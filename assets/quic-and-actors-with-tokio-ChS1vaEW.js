import{e as n,m as o,t as i,o as s,i as c}from"./index-C4Oa_qib.js";import{M as a}from"./post-BHx14SkN.js";import l from"https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";var d=i('<img src=/img/dog-programmer.png alt="Puppy Programmer"class=banner>');function r(t){const e=Object.assign({div:"div",h1:"h1",p:"p",a:"a",em:"em",h2:"h2",pre:"pre",code:"code",h3:"h3",ul:"ul",li:"li",ol:"ol"},a(),t.components);return n(e.div,{className:"markdown-body",get children(){return[d(),`
`,n(e.h1,{children:"QUIC and Actors with Tokio"}),`
`,n(e.p,{get children(){return["After discovering ",n(e.a,{href:"https://ryhl.io/blog/actors-with-tokio/",children:"A. Rhyl, Actors with Tokio"})," in my search of architecting servers in a more modular way via common encapsulation patterns, I was delighted to finally find something that helped me understand the bigger picture. This resource made me rethink server architecture and provided valuable insights into the use of actors with Tokio. The explanations were clear, and the examples were practical, making it an excellent starting point for anyone interested in this topic. However, while it was incredibly informative, I found it did not fully satisfy my needs in my endeavors. I was left wanting more detailed guidance and advanced techniques to further enhance my server architecture."]}}),`
`,n(e.p,{get children(){return n(e.em,{get children(){return["You can find an example server and client (and necessary configuration for QUIC) for this post ",n(e.a,{href:"https://github.com/meowesque",children:"here"})," - for simplicity sake we only go over the server's implementation."]}})}}),`
`,n(e.h2,{children:"Actors with Tokio"}),`
`,n(e.p,{get children(){return["The gist of ",n(e.a,{href:"https://ryhl.io/blog/actors-with-tokio/",children:"A. Rhyl, Actors with Tokio"}),` is how an actor is split into a handle (also referred to as a proxy) and the task. Typically the task is an I/O operation that the handle communicates with, providing a simple interface for the programmer whilst keeping everything decoupled. For example let's first look a simple (pure) actor and handle that doesn't actually interact with the "outside world," merely producing naturals incrementally:`]}}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`use tokio::sync::{oneshot, mpsc};

enum Msg {
  Next(oneshot::Sender<u64>),
}

struct Actor {
  id: u64,
  rx: mpsc::Receiver<Msg>,
}

impl Actor {
  fn new(rx: mpsc::Receiver<Msg>) -> Self {
    Self { 
      id: 0,
      rx,
    }
  }

  async fn run(mut self) {
    while let Some(msg) = self.rx.recv().await {
      self.update(msg);
    }
  }

  fn update(&mut self, msg: Msg) {
    match msg {
      Msg::Next(tx) => {
        // We specify \`let _ = ...\` to ignore handling an error, intentionally!
        let _ = tx.send(self.id);

        self.id += 1;
      }
    }
  }
}
`})}}),`
`,n(e.p,{children:"Initially, you may recognize that this follows a reactive pattern - and you'd be right! This is where the implementation of the task lies."}),`
`,n(e.p,{get children(){return["In the method ",n(e.code,{children:"Actor::run"})," we take ownership of the actor, wait for incoming messages indefinitely. If at any point ",n(e.code,{children:"self.rx.recv()"})," returns ",n(e.code,{children:"Option::None"})," it's presumed that all senders to our receiver have been dropped, we then gracefully shut down."]}}),`
`,n(e.p,{get children(){return["Within the ",n(e.code,{children:"Actor::update"})," method, we intentionally ignore the possibility of an error if we fail to send our response. Again, we presume any receiver has been dropped. So we'll just pretend like nothing happened."]}}),`
`,n(e.h3,{children:"Handle Implementation"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`const CHANNEL_SIZE: usize = 2;

// Note \`pub\` as this is what the user actually interfaces with.
#[derive(Clone)]
pub struct Handle {
  tx: tokio::sync::mpsc::Sender<Msg>
}

impl Handle {
  pub fn new() -> Self {
    let (rx, tx) = tokio::sync::mpsc::channel(CHANNEL_SIZE);
    let actor = Actor::new(rx);

    tokio::spawn(async move { actor.run().await });

    Self { tx }
  }

  /// Retrieve the next unique id.
  pub async fn next(&self) -> u64 {
    let (tx, rx) = tokio::oneshot::channel();

    // If \`self.tx.send\` fails, so does \`rx.await\`.
    // There's no reason to check for errors twice.
    let _ = self.tx.send(Msg::Next(tx)).await;

    rx.await.expect("Actor died")
  }
}
`})}}),`
`,n(e.p,{children:"This is the actor's handle, responsible for spawning a task of which the actor resides, communicating with the actor and providing an interface for the programmer."}),`
`,n(e.h2,{get children(){return["Integrating Our Actors with ",n(e.a,{href:"https://crates.io/crates/quinn",children:"quinn"})]}}),`
`,n(e.p,{get children(){return["The example project can be found ",n(e.a,{href:"https://github.com/meowesque/quic-and-actors-with-tokio",children:"here"}),", where you can find the implementation of the client as well, I haven't included it here given that both the server and the client have nearly identical code when it comes to the actors listed below."]}}),`
`,n(e.p,{children:"Now that we have a basic idea of what an actor looks like, let's build a basic server with QUIC! Our server will be broken into several pieces:"}),`
`,n(e.ul,{get children(){return[`
`,n(e.li,{get children(){return[`
`,n(e.p,{get children(){return[n(e.a,{href:"#listener",children:"Listener"})," Accepts incoming clients and sets up our actors."]}}),`
`]}}),`
`,n(e.li,{get children(){return[`
`,n(e.p,{get children(){return[n(e.a,{href:"#inbound",children:"Inbound"})," Recieves incoming messages from the client."]}}),`
`]}}),`
`,n(e.li,{get children(){return[`
`,n(e.p,{get children(){return[n(e.a,{href:"#outbound",children:"Outbound"})," Sends messages to the client."]}}),`
`]}}),`
`,n(e.li,{get children(){return[`
`,n(e.p,{get children(){return[n(e.a,{href:"#dispatch",children:"Dispatch"})," Handles each client message and acts as a switch for each actors."]}}),`
`]}}),`
`]}}),`
`,n(e.p,{children:"Splitting our actors up into very basic responsibilities is convenient for multiple reasons:"}),`
`,n(e.ol,{get children(){return[`
`,n(e.li,{get children(){return[`
`,n(e.p,{children:"The architecture of the server becomes far more reasonable to work with when amassing more complex tasks."}),`
`]}}),`
`,n(e.li,{get children(){return[`
`,n(e.p,{children:`Legibility is increased given that the effects of an actor is much more apparent in contrast to a monolithic
design.`}),`
`]}}),`
`,n(e.li,{get children(){return[`
`,n(e.p,{children:"Actors provide a form of state encapsulation, keeping moving parts consolidated."}),`
`]}}),`
`,n(e.li,{get children(){return[`
`,n(e.p,{children:"Decoupling provides easier error recovery without sacrificing simplicity."}),`
`]}}),`
`]}}),`
`,n(e.h3,{children:"Listener"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`struct Actor {
  endpoint: quinn::Endpoint,
}

impl Actor {
  async fn run(mut self) {
    while let Some(incoming) = self.endpoint.accept().await {
      log::info!("Accepting connection from {}", incoming.remote_address());

      tokio::spawn(async move {
        // Accept bidirectional channels from the incoming connection
        let (send, recv) = incoming
          .await
          .expect("Failed to accept incoming connection")
          .accept_bi()
          .await
          .expect("Failed to accept a bidirectional stream");

        let outbound = outbound::Handle::new(send);
        let dispatch = dispatch::Handle::new(outbound);
        let inbound = inbound::Handle::new(recv, dispatch);

        inbound.join().await;
      });
    }
  }
}

pub struct Handle {
  join_handle: task::JoinHandle<()>,
}

impl Handle {
  pub fn new(endpoint: quinn::Endpoint) -> Self {
    let actor = Actor { endpoint };

    let join_handle = tokio::spawn(async move { actor.run().await });

    Self { join_handle }
  }

  /// Wait for the listener to terminate.
  pub async fn join(self) {
    self.join_handle.await.expect("Listener actor panicked");
  }
}
`})}}),`
`,n(e.p,{get children(){return n(e.a,{href:"https://github.com/meowesque/quic-and-actors-with-tokio/blob/main/crates/server/src/actors/listener.rs",children:"Source"})}}),`
`,n(e.p,{get children(){return["Within ",n(e.code,{children:"Actor::run"})," whenever we accept an incomming connection, we'll accept bidirectional channels to seperate recieving and sending data into two actors: ",n(e.a,{href:"#inbound",children:"Inbound"})," and ",n(e.a,{href:"#outbound",children:"Outbound"}),". The ",n(e.a,{href:"#inbound",children:"inbound actor"})," will be equipped with its own newly created ",n(e.a,{href:"#dispatch",children:"dispatch"})," actor handle."]}}),`
`,n(e.h3,{children:"Inbound"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`const CHANNEL_SIZE: usize = 8;
const BUFFER_SIZE: usize = 1024 * 8;

struct Actor {
  stream: quinn::RecvStream,
  dispatch: dispatch::Handle,
}

impl Actor {
  async fn run(mut self) {
    let mut buffer = Box::new([0u8; BUFFER_SIZE]);

    loop {
      match self
        .stream
        .read(buffer.as_mut())
        .await
        .expect("Failed to read stream")
      {
        Some(0) | None => continue,
        Some(read) => {
          let client_message =
            bitcode::decode(&buffer[..read]).expect("Failed to decode ClientMessage");

          self.dispatch.send(client_message).await;
        }
      }
    }
  }
}

pub struct Handle {
  join_handle: task::JoinHandle<()>,
}

impl Handle {
  pub fn new(stream: quinn::RecvStream, dispatch: dispatch::Handle) -> Self {
    let actor = Actor { stream, dispatch };

    let join_handle = tokio::spawn(async move { actor.run().await });

    Self { join_handle }
  }

  /// Wait for the actor to finish processing inbound messages.
  pub async fn join(self) {
    self.join_handle.await.expect("Failed to join actor");
  }
}
`})}}),`
`,n(e.p,{get children(){return n(e.a,{href:"https://github.com/meowesque/quic-and-actors-with-tokio/blob/main/crates/server/src/actors/inbound.rs",children:"Source"})}}),`
`,n(e.p,{get children(){return["This our first seemingly complex actor, the goal here is to receive incoming data and deserialize it with ",n(e.a,{href:"crates.io/crates/bitcode",children:"bitcode"})," and send it off to be dispatched. Any deserialization crate (like ",n(e.a,{href:"crates.io/crates/bincode",children:"bincode"}),") will do. For performance and memory efficient applications that need to scale, ",n(e.a,{href:"crates.io/crates/bitcode",children:"bitcode"})," may be preferrable."]}}),`
`,n(e.h3,{children:"Outbound"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`const CHANNEL_SIZE: usize = 8;

struct Actor {
  stream: quinn::SendStream,
  rx: mpsc::Receiver<proto::server::Message>,
}

impl Actor {
  async fn run(mut self) {
    while let Some(msg) = self.rx.recv().await {
      self.send(msg).await;
    }
  }

  async fn send(&mut self, message: proto::server::Message) {
    let buffer = bitcode::encode(&message);

    self
      .stream
      .write_all(&buffer)
      .await
      .expect("Failed to write message to stream");

    self.stream.flush().await.expect("Failed to flush stream");
  }
}

#[derive(Clone)]
pub struct Handle {
  tx: mpsc::Sender<proto::server::Message>,
}

impl Handle {
  pub fn new(stream: quinn::SendStream) -> Self {
    let (tx, rx) = mpsc::channel(CHANNEL_SIZE);
    let actor = Acotr { stream, rx };

    tokio::spawn(async move { actor.run() });

    Self { tx }
  }

  pub async fn send(&self, message: proto::server::Message) {
    self
      .tx
      .send(message)
      .await
      .expect("Failed to send message");
  }
}
`})}}),`
`,n(e.p,{get children(){return n(e.a,{href:"https://github.com/meowesque/quic-and-actors-with-tokio/blob/main/crates/server/src/actors/outbound.rs",children:"Source"})}}),`
`,n(e.p,{children:"This actor is trivial, existing only to encode messages and send them to the channel."}),`
`,n(e.h3,{children:"Dispatch"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`const CHANNEL_SIZE: usize = 16;

struct Actor {
  rx: mpsc::Receiver<proto::client::Message>,
  outbound: outbound::Handle,
}

impl Actor {
  async fn run(mut self) {
    while let Some(message) = self.rx.recv().await {
      log::info!("Received message: {:?}", message);

      // Match on message, communicate with other actors, etc.
    }
  }
}

#[derive(Clone)]
pub struct Handle {
  tx: mpsc::Sender<proto::client::Message>,
}

impl Handle {
  pub fn new(outbound: outbound::Handle) -> Self {
    let (tx, rx) = mpsc::channel(CHANNEL_SIZE);
    let actor = Actor { rx, outbound };

    tokio::spawn(async move { actor.run().await });

    Self { tx }
  }

  pub async fn send(&self, message: proto::client::Message) {
    self
      .tx
      .send(message)
      .await
      .expect("Failed to send actor a message");
  }
}
`})}}),`
`,n(e.p,{get children(){return n(e.a,{href:"https://github.com/meowesque/quic-and-actors-with-tokio/blob/main/crates/server/src/actors/dispatch.rs",children:"Source"})}}),`
`,n(e.p,{children:"The purpose of this actor is to only communicate with other actors, possibly even keeping track of certain events (like authentication)."}),`
`,n(e.h2,{children:"Improvements"}),`
`,n(e.p,{children:"Overall, there are a few things I would want to improve in a production scenario:"}),`
`,n(e.ol,{get children(){return[`
`,n(e.li,{get children(){return[`
`,n(e.p,{children:"Buffering the outbound actor, saving flush times. This could be especially critical for high throughput scenarios."}),`
`]}}),`
`,n(e.li,{get children(){return[`
`,n(e.p,{children:"Utilize chunking on the inbound actor for handling potentially large portions of data."}),`
`]}}),`
`,n(e.li,{get children(){return[`
`,n(e.p,{children:"Tracking each client handle within the listener actor."}),`
`]}}),`
`]}}),`
`,n(e.p,{get children(){return["Regardless, I've been really enjoying my experience implementing actors with ",n(e.a,{href:"crates.io/crates/tokio",children:"tokio"})," and ",n(e.a,{href:"crates.io/crates/quinn",children:"quinn"}),"."]}})]}})}function h(t={}){const{wrapper:e}=Object.assign({},a(),t.components);return e?n(e,o(t,{get children(){return n(r,t)}})):r(t)}var u=i('<div class="min-h-screen bg-black text-white"><div class="container w-full md:w-3/4 lg:w-216 mx-auto">');function f(){return s(async()=>{hljs.highlightAll(),await l.run({querySelector:".language-mermaid"})}),(()=>{var t=u(),e=t.firstChild;return c(e,n(h,{})),t})()}export{f as default};
