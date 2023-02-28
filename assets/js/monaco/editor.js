// Initial data
const HTML_CODE = (
    `//my life cycle
while ($me.isAlive()) {
    $me.eat();
    $me.sleep();
    $me.code();
}
    `);
    const CSS_LINKS = [`https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css`];
    
    // Elements
    const editorCode = document.getElementById("editorCode");
    
    
    // Monaco loader
    require.config({
       paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor/min/vs" }
    });
    
    window.MonacoEnvironment = {
       getWorkerUrl: function(workerId, label) {
          return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
            self.MonacoEnvironment = {
              baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor/min/'
            };
            importScripts('https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/base/worker/workerMain.js');`)}`;
       }
    };
    
    // Monaco init
    require(["vs/editor/editor.main"], function() {
       createEditor(editorCode);
    });
    
    function createEditor(editorContainer) {
       let editor = monaco.editor.create(editorContainer, {
          value: HTML_CODE,
          language: "javascript",
          minimap: { enabled: false },
          automaticLayout: true,
          contextmenu: false,
          fontSize: 24,
          theme: "vs-dark",
          scrollbar: {
             useShadows: false,
             vertical: "visible",
             horizontal: "invisible",
             horizontalScrollbarSize: 1,
             verticalScrollbarSize: 7,
          }
       });
       
    }

