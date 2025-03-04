import{u as s,b as c,a as n,m as a,D as l,t as i,o as d,i as h}from"./index-3MmtAk4F.js";import u from"https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";var p=["html","base","head","link","meta","style","title","body","address","article","aside","footer","header","main","nav","section","body","blockquote","dd","div","dl","dt","figcaption","figure","hr","li","ol","p","pre","ul","a","abbr","b","bdi","bdo","br","cite","code","data","dfn","em","i","kbd","mark","q","rp","rt","ruby","s","samp","small","span","strong","sub","sup","time","u","var","wbr","area","audio","img","map","track","video","embed","iframe","object","param","picture","portal","source","svg","math","canvas","noscript","script","del","ins","caption","col","colgroup","table","tbody","td","tfoot","th","thead","tr","button","datalist","fieldset","form","input","label","legend","meter","optgroup","option","output","progress","select","textarea","details","dialog","menu","summary","details","slot","template","acronym","applet","basefont","bgsound","big","blink","center","content","dir","font","frame","frameset","hgroup","image","keygen","marquee","menuitem","nobr","noembed","noframes","plaintext","rb","rtc","shadow","spacer","strike","tt","xmp","a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","bgsound","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","head","header","h1","h2","h3","h4","h5","h6","hgroup","hr","html","i","iframe","image","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","nobr","noembed","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","plaintext","portal","pre","progress","q","rb","rp","rt","rtc","ruby","s","samp","script","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr","xmp","input"],m=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected"];new Set(m);var f=new Set(["altGlyph","altGlyphDef","altGlyphItem","animate","animateColor","animateMotion","animateTransform","circle","clipPath","color-profile","cursor","defs","desc","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","font","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignObject","g","glyph","glyphRef","hkern","image","line","linearGradient","marker","mask","metadata","missing-glyph","mpath","path","pattern","polygon","polyline","radialGradient","rect","set","stop","svg","switch","symbol","text","textPath","tref","tspan","use","view","vkern"]),g=c(Object.fromEntries([...p,...f.keys()].map(r=>[r,function(e){return e=a(e,{component:r}),n(l,e)}]))),o=()=>s(g),b=i('<img src=/dog-programmer.png alt="Puppy Programmer"class=banner>');function t(r){const e=Object.assign({div:"div",h1:"h1",p:"p",a:"a",h2:"h2",h3:"h3",pre:"pre",code:"code",ul:"ul",li:"li"},o(),r.components);return n(e.div,{className:"markdown-body",get children(){return[b(),`
`,n(e.h1,{children:"QUIC and Actors with Tokio"}),`
`,n(e.p,{get children(){return["After discovering ",n(e.a,{href:"https://ryhl.io/blog/actors-with-tokio/",children:"A. Rhyl, Actors with Tokio"})," in my search of architecting servers in a more modular way via common encapsulation patterns, I was delighted to finally find something that helped me understand the bigger picture. This resource made me rethink server architecture and provided valuable insights into the use of actors with Tokio. The explanations were clear, and the examples were practical, making it an excellent starting point for anyone interested in this topic. However, while it was incredibly informative, I found it did not fully satisfy my needs in my endeavors. I was left wanting more detailed guidance and advanced techniques to further enhance my server architecture."]}}),`
`,n(e.h2,{children:"Actors with Tokio"}),`
`,n(e.p,{get children(){return["The gist of ",n(e.a,{href:"https://ryhl.io/blog/actors-with-tokio/",children:"A. Rhyl, Actors with Tokio"}),` is how an actor is split into a handle (also referred to as a proxy) and the task. Typically the task is an I/O operation that the handle communicates with, providing a simple interface for the programmer whilst keeping everything decoupled. Let's first look a simple (pure) actor and handle that doesn't actually interact with the "outside world," merely producing naturals incrementally:`]}}),`
`,n(e.h3,{children:"Actor Implementation"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`enum Msg {\r
  Next(tokio::sync::oneshot::Sender<u64>),\r
}\r
\r
struct Actor {\r
  id: u64,\r
  rx: tokio::sync::mpsc::Receiver<Msg>,\r
}\r
\r
impl Actor {\r
  fn new(rx: tokio::sync::mpsc::Receiver<Msg>) -> Self {\r
    Self { \r
      id: 0,\r
      rx,\r
    }\r
  }\r
\r
  async fn run(mut self) {\r
    while let Some(msg) = self.rx.recv().await {\r
      self.update(msg);\r
    }\r
  }\r
\r
  fn update(&mut self, msg: Msg) {\r
    match msg {\r
      Msg::Next(tx) => {\r
        // We specify \`let _ = ...\` to ignore handling an error, intentionally!\r
        let _ = tx.send(self.id);\r
\r
        self.id += 1;\r
      }\r
    }\r
  }\r
}
`})}}),`
`,n(e.h3,{children:"Handle Implementation"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`const CHANNEL_SIZE: usize = 2;\r
\r
// Note \`pub\` as this is what the user actually interfaces with.\r
#[derive(Clone)]\r
pub struct Handle {\r
  tx: tokio::sync::mpsc::Sender<Msg>\r
}\r
\r
impl Handle {\r
  pub fn new() -> Self {\r
    let (rx, tx) = tokio::sync::mpsc::channel(CHANNEL_SIZE);\r
    let actor = Actor::new(rx);\r
\r
    tokio::spawn(async move { actor.run().await });\r
\r
    Self { tx }\r
  }\r
\r
  /// Retrieve the next unique id.\r
  pub async fn next(&self) -> u64 {\r
    let (tx, rx) = tokio::oneshot::channel();\r
\r
    // If \`self.tx.send\` fails, so does \`rx.await\`.\r
    // There's no reason to check for errors twice.\r
    let _ = self.tx.send(Msg::Next(tx)).await;\r
\r
    rx.await.expect("Actor died")\r
  }\r
}
`})}}),`
`,n(e.p,{get children(){return["We utilize ",n(e.code,{children:"tokio::sync::mpsc"}),", a multi-producer, single consumer channel. Meaning, there can only exist one consumer (our actor) and there can be many producers (clones of our actor handle)."]}}),`
`,n(e.p,{get children(){return["In the method ",n(e.code,{children:"Actor::run"})," we take ownership of the actor, wait for incoming messages indefinitely. If at any point ",n(e.code,{children:"self.rx.recv()"})," returns ",n(e.code,{children:"Option::None"})," it's presumed that all senders to our receiver have been dropped, we then gracefully shut down."]}}),`
`,n(e.p,{get children(){return["Within the ",n(e.code,{children:"Actor::update"})," method, we intentionally ignore the possibility of an error if we fail to send our response. Again, we presume any receiver has been dropped. So we'll just pretend like nothing happened."]}}),`
`,n(e.h2,{get children(){return["Getting Started with ",n(e.a,{href:"https://crates.io/crates/quinn",children:"quinn"})]}}),`
`,n(e.p,{get children(){return["The example project can be found ",n(e.a,{href:"https://github.com/maxinedeandrade/quic-and-actors-with-tokio",children:"here"}),"."]}}),`
`,n(e.p,{children:"Now that we have a basic idea of what an actor looks like, let's build a basic server with QUIC!"}),`
`,n(e.p,{children:"Our server will be broken into several pieces:"}),`
`,n(e.ul,{get children(){return[`
`,n(e.li,{get children(){return[n(e.a,{href:"#listener",children:"Listener"})," Accepts incoming clients and sets up our actors."]}}),`
`,n(e.li,{get children(){return[n(e.a,{href:"#inbound",children:"Inbound"})," Recieves incoming messages from the client."]}}),`
`,n(e.li,{get children(){return[n(e.a,{href:"#outbound",children:"Outbound"})," Sends messages to the client."]}}),`
`,n(e.li,{get children(){return[n(e.a,{href:"#dispatch",children:"Dispatch"})," Handles each client message and acts as a switch for each actors."]}}),`
`]}}),`
`,n(e.p,{children:"Splitting our actors up into very basic responsibilities is convenient for multiple reasons:"}),`
`,n(e.ul,{get children(){return[`
`,n(e.li,{children:"The architecture of the server becomes far more reasonable to work with when amassing more complex tasks."}),`
`,n(e.li,{children:"Legibility is increased given that the effects of an actor is much more apparent in contrast to a monolithic design."}),`
`,n(e.li,{children:"Actors provide a form of state encapsulation, keeping moving parts consolidated."}),`
`,n(e.li,{children:"Decoupling provides easier error recovery without sacrificing simplicity."}),`
`]}}),`
`,n(e.h3,{children:"Listener"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`struct Actor {\r
  endpoint: quinn::Endpoint,\r
}\r
\r
impl Actor {\r
  async fn run(mut self) {\r
    while let Some(incoming) = self.endpoint.accept().await {\r
      log::info!("Accepting connection from {}", incoming.remote_address());\r
\r
      tokio::spawn(async move {\r
        // Accept bidirectional channels from the incoming connection\r
        let (send, recv) = incoming\r
          .await\r
          .expect("Failed to accept incoming connection")\r
          .accept_bi()\r
          .await\r
          .expect("Failed to accept a bidirectional stream");\r
\r
        let outbound = outbound::Handle::new(send);\r
        let dispatch = dispatch::Handle::new(outbound);\r
        let inbound = inbound::Handle::new(recv, dispatch);\r
\r
        inbound.join().await;\r
      });\r
    }\r
  }\r
}\r
\r
pub struct Handle {\r
  join_handle: task::JoinHandle<()>,\r
}\r
\r
impl Handle {\r
  pub fn new(endpoint: quinn::Endpoint) -> Self {\r
    let actor = Actor { endpoint };\r
\r
    let join_handle = tokio::spawn(async move { actor.run().await });\r
\r
    Self { join_handle }\r
  }\r
\r
  /// Wait for the listener to terminate.\r
  pub async fn join(self) {\r
    self.join_handle.await.expect("Listener actor panicked");\r
  }\r
}
`})}}),`
`,n(e.p,{get children(){return n(e.a,{href:"https://github.com/maxinedeandrade/quic-and-actors-with-tokio/blob/main/crates/server/src/actors/listener.rs",children:"Source"})}}),`
`,n(e.p,{get children(){return["Within ",n(e.code,{children:"Actor::run"})," whenever we accept an incomming connection, we'll accept bidirectional channels to seperate recieving and sending data into two actors: ",n(e.a,{href:"#inbound",children:"Inbound"})," and ",n(e.a,{href:"#outbound",children:"Outbound"}),". The ",n(e.a,{href:"#inbound",children:"inbound actor"})," will be equipped with its own newly created ",n(e.a,{href:"#dispatch",children:"dispatch"})," actor handle."]}}),`
`,n(e.h3,{children:"Inbound"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`const CHANNEL_SIZE: usize = 8;\r
const BUFFER_SIZE: usize = 1024 * 8;\r
\r
struct Actor {\r
  stream: quinn::RecvStream,\r
  dispatch: dispatch::Handle,\r
}\r
\r
impl Actor {\r
  async fn run(mut self) {\r
    let mut buffer = Box::new([0u8; BUFFER_SIZE]);\r
\r
    loop {\r
      match self\r
        .stream\r
        .read(buffer.as_mut())\r
        .await\r
        .expect("Failed to read stream")\r
      {\r
        Some(0) | None => continue,\r
        Some(read) => {\r
          let client_message =\r
            bitcode::decode(&buffer[..read]).expect("Failed to decode ClientMessage");\r
\r
          self.dispatch.send(client_message).await;\r
        }\r
      }\r
    }\r
  }\r
}\r
\r
pub struct Handle {\r
  join_handle: task::JoinHandle<()>,\r
}\r
\r
impl Handle {\r
  pub fn new(stream: quinn::RecvStream, dispatch: dispatch::Handle) -> Self {\r
    let actor = Actor { stream, dispatch };\r
\r
    let join_handle = tokio::spawn(async move { actor.run().await });\r
\r
    Self { join_handle }\r
  }\r
\r
  /// Wait for the actor to finish processing inbound messages.\r
  pub async fn join(self) {\r
    self.join_handle.await.expect("Failed to join actor");\r
  }\r
}
`})}}),`
`,n(e.p,{get children(){return n(e.a,{href:"https://github.com/maxinedeandrade/quic-and-actors-with-tokio/blob/main/crates/server/src/actors/inbound.rs",children:"Source"})}}),`
`,n(e.p,{get children(){return["This our first seemingly complex actor, the goal here is to receive incoming data and deserialize it with ",n(e.a,{href:"crates.io/crates/bitcode",children:"bitcode"})," and send it off to be dispatched. Any deserialization crate (like ",n(e.a,{href:"crates.io/crates/bincode",children:"bincode"}),") will do. For performance and memory efficient applications that need to scale, ",n(e.a,{href:"crates.io/crates/bitcode",children:"bitcode"})," may be preferrable."]}}),`
`,n(e.h3,{children:"Outbound"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`const CHANNEL_SIZE: usize = 8;\r
\r
struct Actor {\r
  stream: quinn::SendStream,\r
  rx: mpsc::Receiver<proto::server::Message>,\r
}\r
\r
impl Actor {\r
  async fn run(mut self) {\r
    while let Some(msg) = self.rx.recv().await {\r
      self.send(msg).await;\r
    }\r
  }\r
\r
  async fn send(&mut self, message: proto::server::Message) {\r
    let buffer = bitcode::encode(&message);\r
\r
    self\r
      .stream\r
      .write_all(&buffer)\r
      .await\r
      .expect("Failed to write message to stream");\r
\r
    self.stream.flush().await.expect("Failed to flush stream");\r
  }\r
}\r
\r
#[derive(Clone)]\r
pub struct Handle {\r
  tx: mpsc::Sender<proto::server::Message>,\r
}\r
\r
impl Handle {\r
  pub fn new(stream: quinn::SendStream) -> Self {\r
    let (tx, rx) = mpsc::channel(CHANNEL_SIZE);\r
\r
    tokio::spawn(Actor { stream, rx }.run());\r
\r
    Self { tx }\r
  }\r
\r
  pub async fn send(&self, message: proto::server::Message) {\r
    self\r
      .tx\r
      .send(message)\r
      .await\r
      .expect("Failed to send message");\r
  }\r
}
`})}}),`
`,n(e.p,{get children(){return n(e.a,{href:"https://github.com/maxinedeandrade/quic-and-actors-with-tokio/blob/main/crates/server/src/actors/outbound.rs",children:"Source"})}}),`
`,n(e.p,{children:"This actor is trivial, existing only to encode messages and send them to the client."}),`
`,n(e.h3,{children:"Dispatch"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-rust",children:`const CHANNEL_SIZE: usize = 16;\r
\r
struct Actor {\r
  rx: mpsc::Receiver<proto::client::Message>,\r
  outbound: outbound::Handle,\r
}\r
\r
impl Actor {\r
  async fn run(mut self) {\r
    while let Some(message) = self.rx.recv().await {\r
      log::info!("Received message: {:?}", message);\r
\r
      // Match on message, communicate with other actors, etc.\r
    }\r
  }\r
}\r
\r
#[derive(Clone)]\r
pub struct Handle {\r
  tx: mpsc::Sender<proto::client::Message>,\r
}\r
\r
impl Handle {\r
  pub fn new(outbound: outbound::Handle) -> Self {\r
    let (tx, rx) = mpsc::channel(CHANNEL_SIZE);\r
    let actor = Actor { rx, outbound };\r
\r
    tokio::spawn(async move { actor.run().await });\r
\r
    Self { tx }\r
  }\r
\r
  pub async fn send(&self, message: proto::client::Message) {\r
    self\r
      .tx\r
      .send(message)\r
      .await\r
      .expect("Failed to send actor a message");\r
  }\r
}
`})}}),`
`,n(e.p,{get children(){return n(e.a,{href:"https://github.com/maxinedeandrade/quic-and-actors-with-tokio/blob/main/crates/server/src/actors/dispatch.rs",children:"Source"})}}),`
`,n(e.p,{children:"The purpose of this actor is to only communicate with other actors, possibly even keeping track of certain events (like authentication) out of pure convenience for the programmer."})]}})}function w(r={}){const{wrapper:e}=Object.assign({},o(),r.components);return e?n(e,a(r,{get children(){return n(t,r)}})):t(r)}var y=i('<div class="min-h-screen bg-black text-white"><div class="container w-full md:w-3/4 lg:w-1/2 mx-auto">');function k(){return d(async()=>{hljs.highlightAll(),await u.run({querySelector:".language-mermaid"})}),(()=>{var r=y(),e=r.firstChild;return h(e,n(w,{})),r})()}export{k as default};
