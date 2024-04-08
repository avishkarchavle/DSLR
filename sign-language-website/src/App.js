import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Code from './components/Code';
import SignLanguageRecognition from './components/SignLanguageRecognition';
import About from './components/About';
import TextToSpeech from './components/TextToSpeech'


import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">

            <Link to="/" className="navbar-brand">
              DSLR
            </Link>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mr-auto">

                <li className="nav-item">
                  <Link to="/sign-language-recognition" className="nav-link">
                    Sign Language Recognition
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/texttospeech" className="nav-link">
                    Text to Speech
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/about" className="nav-link">
                    About
                  </Link>
                </li>

                {/* <li className="nav-item">
                  <Link to="/code" className="nav-link">
                    Code
                  </Link>
                </li> */}

              </ul>
            </div>
          </nav>

          <hr />

          <div className="container mt-4">
            <Routes>
              <Route path="/sign-language-recognition" element={<SignLanguageRecognition />} />
              <Route path="/about" element={<About />} />
              <Route path="/texttospeech" element={<TextToSpeech />} />
              <Route path="/" element={<Home />} />
              <Route path="/code" element={<Code />} />

            </Routes>
          </div>

        </div>
      </div>
    </Router>
  );
}

export default App;
