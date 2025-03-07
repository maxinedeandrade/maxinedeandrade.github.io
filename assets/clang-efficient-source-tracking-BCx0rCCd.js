import{e as n,m as o,o as a,t as c,i as l}from"./index-C4Oa_qib.js";import{M as i}from"./post-BHx14SkN.js";import s from"https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs";function r(t){const e=Object.assign({div:"div",h1:"h1",p:"p",a:"a",code:"code",pre:"pre"},i(),t.components);return n(e.div,{className:"markdown-body",get children(){return[n(e.h1,{children:"Clang: Efficient Source Tracking"}),`
`,n(e.p,{get children(){return["Sometimes I can't sleep, and on those days, I like to read the ",n(e.a,{href:"https://github.com/llvm/llvm-project/tree/main/clang",children:"clang"})," source. Whilst developing my own programming languages I like to see how other performant compilers are implemented, and clang has been a consistent choice (especially for ",n(e.a,{href:"https://github.com/maxinedeandrade/catk",children:"catk"})," which is mostly a C frontend)."]}}),`
`,n(e.p,{get children(){return["Onto the cool stuff. Within ",n(e.a,{href:"https://clang.llvm.org/doxygen/SourceLocation_8h_source.html",get children(){return n(e.code,{children:"clang::SourceLocation"})}}),", utilized by ",n(e.a,{href:"https://clang.llvm.org/doxygen/classclang_1_1SourceManager.html",get children(){return n(e.code,{children:"clang::SourceManager"})}})," something odd appears, why does it only have an ID? Where's my filepath, line and column? (looking at you - mega/parsec)."]}}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-cpp",children:`class SourceLocation {
  friend class ASTReader;
  friend class ASTWriter;
  friend class SourceManager;
  friend struct llvm::FoldingSetTrait<SourceLocation, void>;
  friend class SourceLocationEncoding;
 
public:
  using UIntTy = uint32_t;
  using IntTy = int32_t;
 
private:
  UIntTy ID = 0;

// ...
}
`})}}),`
`,n(e.p,{children:"So what defines the ID? It's just an offset within source files, among all source files - as if it's one large source file. There's one interesting bit I omitted:"}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-cpp",children:`enum : UIntTy { MacroIDBit = 1ULL << (8 * sizeof(UIntTy) - 1) };
`})}}),`
`,n(e.p,{get children(){return["There's a bit thats ticked if the ",n(e.code,{children:"SourceLocation"})," is within a macro expansion! Later down in the definition they define a method ",n(e.code,{children:"getMacroLoc"})," which just toggles it off."]}}),`
`,n(e.pre,{get children(){return n(e.code,{className:"language-cpp",children:`class SourceLocation {
//...

static SourceLocation getMacroLoc(UIntTy ID) {
  assert((ID & MacroIDBit) == 0 && "Ran out of source locations!");
  SourceLocation L;
  L.ID = MacroIDBit | ID;
  return L;
}

//...
};
`})}}),`
`,n(e.p,{children:"Seeing the neat tricks that clang has given us, here's how we'd implement this in Rust:"}),`
`,n(e.p,{children:"WIP!"})]}})}function h(t={}){const{wrapper:e}=Object.assign({},i(),t.components);return e?n(e,o(t,{get children(){return n(r,t)}})):r(t)}var d=c('<div class="min-h-screen bg-black text-white"><div class="container w-full md:w-3/4 lg:w-216 mx-auto">');function p(){return a(async()=>{hljs.highlightAll(),await s.run({querySelector:".language-mermaid"})}),(()=>{var t=d(),e=t.firstChild;return l(e,n(h,{})),t})()}export{p as default};
