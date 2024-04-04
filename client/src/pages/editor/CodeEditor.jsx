import { useState, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import "./CodeEditor.css"; // Import the CSS file for styling

const CodeEditor = () => {
  const [editors, setEditors] = useState([
    { id: 1, value: "", language: "javascript" },
  ]);
  const [selectedEditorId, setSelectedEditorId] = useState(1); // Initially select the first editor by its id
  const [selectedNav, setSelectedNav] = useState("editors");
  const [outputValue] = useState("");
  const leftPartitionRef = useRef(null);
  const rightPartitionRef = useRef(null);
  const outputBlockRef = useRef(null);

  const addEditor = () => {
    const newId = editors.length + 1;
    const newEditor = { id: newId, value: "", language: "javascript" };
    setEditors([...editors, newEditor]);
    setSelectedEditorId(newId); // Set the newly added editor as selected
  };

  const handleEditorChange = (id, value) => {
    const updatedEditors = editors.map((editor) =>
      editor.id === id ? { ...editor, value: value } : editor
    );
    setEditors(updatedEditors);
  };

  const handleEditorSelect = (id) => {
    setSelectedEditorId(id); // Update the selected editor id
  };

  const handleDeleteEditor = (id) => {
    // Filter out the editor with the given id
    const updatedEditors = editors.filter((editor) => editor.id !== id);
    setEditors(updatedEditors);
    // If the deleted editor was the selected one, select the first editor in the list
    if (selectedEditorId === id) {
      setSelectedEditorId(
        updatedEditors.length > 0 ? updatedEditors[0].id : null
      );
    }
  };

  const handleNavSelect = (nav) => {
    setSelectedNav(nav);
  };

  const handleResize = (e) => {
    const leftPartitionWidth = leftPartitionRef.current.offsetWidth;
    const rightPartitionWidth = rightPartitionRef.current.offsetWidth;
    const totalWidth = leftPartitionWidth + rightPartitionWidth;
    const newLeftPartitionWidth =
      e.clientX - leftPartitionRef.current.getBoundingClientRect().left;
    const newRightPartitionWidth = totalWidth - newLeftPartitionWidth;

    leftPartitionRef.current.style.width = `${newLeftPartitionWidth}px`;
    rightPartitionRef.current.style.width = `${newRightPartitionWidth}px`;
  };

  return (
    <div className="code-editor-page">
      <div className="navbar">
        <div className="user-info">User Name</div>
        <button className="logout-button">Logout</button>
      </div>
      <div className="main-content">
        <div
          className="left-partition"
          ref={leftPartitionRef}
          onMouseDown={(e) => {
            e.preventDefault();
            document.addEventListener("mousemove", handleResize);
            document.addEventListener("mouseup", () => {
              document.removeEventListener("mousemove", handleResize);
            });
          }}
        >
          <div className="nav-vertical">
            <ul>
              <li onClick={() => handleNavSelect("editors")}>
                <i className="fas fa-file-alt"></i>
              </li>
              <li onClick={() => handleNavSelect("submissions")}>
                <i className="fas fa-database"></i>
              </li>
            </ul>
          </div>
          <div className="file-section">
            {selectedNav === "editors" && (
              <>
                <h2>Open Editors</h2>
                <button onClick={addEditor}>Add Editor</button>
                <ul>
                  {editors.map((editor) => (
                    <li
                      key={editor.id}
                      onClick={() => handleEditorSelect(editor.id)}
                      className={
                        editor.id === selectedEditorId ? "selected-editor" : ""
                      }
                    >
                      Editor {editor.id}
                      <button onClick={() => handleDeleteEditor(editor.id)}>
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {selectedNav === "submissions" && (
              <>
                <h2>Submissions</h2>
                {/* Render submissions list here */}
              </>
            )}
          </div>
        </div>

        <div className="right-partition" ref={rightPartitionRef}>
          <nav>
            <div className="lang-select">
              <select name="Language" id="language">
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div className="nav-left">
              <ul>
                {editors.map((editor) => (
                  <li
                    key={editor.id}
                    onClick={() => handleEditorSelect(editor.id)}
                    className={`opened-editor ${
                      editor.id === selectedEditorId ? "selected-editor" : ""
                    }`} // Apply conditional class
                  >
                    Editor {editor.id}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="selected-editor">
            <Editor
              options={{
                minimap: {
                  enabled: false,
                },
              }}
              height="calc(100vh - 75px)"
              theme="vs-dark"
              language={
                editors.find((editor) => editor.id === selectedEditorId)
                  ?.language || "javascript"
              }
              value={
                editors.find((editor) => editor.id === selectedEditorId)
                  ?.value || ""
              }
              onChange={(value) => handleEditorChange(selectedEditorId, value)}
            />
          </div>
        </div>
        <div className="output-block" ref={outputBlockRef}>
          <div className="output-top">
            <button>Run</button>
            <button>Submit</button>
          </div>
          <div className="output-area">
            <textarea
              className="output-textarea"
              readOnly
              value={outputValue}
              placeholder="Output will appear here..."
            />
          </div>
          <div className="testcase-area">
            <textarea
              className="testcase-textarea"
              placeholder="Enter test cases here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
