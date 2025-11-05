import "./App.css";
import React, { useState , useRef , useEffect } from "react";
import axios from "axios";
import Footer from "./components/Footer";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

 useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // smooth scroll works fine in React
      });
    }
  }, [messages]);


  async function SendMessage() {
    const newUserMessage = { role: "user", content: input };
    const newMessages = [...messages, newUserMessage];

    // Step 2: Add temporary loading message
    const loadingMessage = { role: "ai", content: "Typing..." };
    setMessages([...newMessages, loadingMessage]);
    setInput("");
    setLoading(true)
    try {
      // setMessages([...messages ,{role:"user" , content:input}])
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });
      const data = response.data;
       // Step 4: Replace loading message with actual AI reply
    setMessages([
      ...newMessages,
      { role: "ai", content: data.reply },
    ]);
    } catch (error) {
      console.log("error in Sendmessage function", error);
      setMessages([
      ...messages,
      { role: "user", content: input },
      { role: "ai", content: "⚠️ Something went wrong. Please try again." },
    ]);
    }finally{
      setLoading(false)
    }
  }
  // console.log(messages);

  return (
    <>
      <div className="parent">
        <h2 className="" style={{color:" #FBEAEB"}}>Meet My DevChat.</h2>
        <div className="chatbot">
          <div className="messages" ref={chatContainerRef}>
            {messages.length > 0 ? (
            <>
            {messages.map((msg, i) => {
                return (
                  <p key={i} className={msg.role}>
                    {msg.content}
                  </p>
                );
              })}
            {/* {
              loading && <p>Ai is Typing ....</p>
            } */}
            </>
            )
            : (
              <p className="fs-4 fw-medium text-capitalize text-center">How i can help You Today .</p>
            )}
          </div>

          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Anything..."
              aria-label="Recipient’s username"
              aria-describedby="button-addon2"
            />
            <button
              className="btn btn-primary"
              disabled={input.length < 1 || loading}
              onClick={SendMessage}
              type="button"
              id="button-addon2"
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default React.memo(App);
