import React, { useState } from 'react';
import Papa from 'papaparse';
import './app.css';

function App() {
  const [data, setData] = useState([]);
  const [bibNumber, setBibNumber] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [csvUploaded, setCsvUploaded] = useState(false);

  const getCertificateImage = (bib) => {
    if (bib >= 2000 && bib <= 2999) {
      return {
        image: 'https://i.ibb.co/mJLyWGy/2KM.jpg',
        namePos: { x: '68%', y: '28%' },
        bibPos: { x: '68%', y: '21%' },
        categoryPos: { x: '68%', y: '10%' },
        nameColor: '#FF2929',
        bibColor: '#FF2929',
        categoryColor: 'orange',
      };
    }
    if (bib >= 10000 && bib <= 10999) {
      return {
        image: 'https://i.ibb.co/kGFgfhB/10KM.jpg',
        namePos: { x: '67%', y: '26%' },
        bibPos: { x: '67%', y: '19%' },
        categoryPos: { x: '', y: '' },
        nameColor: 'white',
        bibColor: 'orange',
      };
    }
    if (bib >= 21000 && bib <= 21999) {
      return {
        image: 'https://i.ibb.co/JswXf3D/21KM.jpg',
        namePos: { x: '67.5%', y: '25%' },
        bibPos: { x: '67.5%', y: '18%' },
        categoryPos: { x: '', y: '' },
        nameColor: 'white',
        bibColor: 'white',
      };
    }
    if (bib >= 50000) {
      return {
        image: 'https://i.ibb.co/PG9xv1B/5KM.jpg',
        namePos: { x: '67.5%', y: '25%' },
        bibPos: { x: '67.5%', y: '18%' },
        categoryPos: { x: '%', y: '' },
        nameColor: 'white',
        bibColor: 'white',
      };
    }
    return {
      image: '',
      namePos: { x: '50%', y: '45%' },
      bibPos: { x: '50%', y: '45%' },
      categoryPos: { x: '50%', y: '50%' },
      nameColor: 'black',
      bibColor: 'black',
      categoryColor: 'gray',
    };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setData(result.data);
        setCsvUploaded(true);
      },
    });
  };

  const handleSearch = () => {
    const entry = data.find((row) => row.bibNumber == bibNumber);
    setSelectedEntry(entry || null);
    if (entry) {
      const {
        image,
        namePos,
        bibPos,
        categoryPos,
        nameColor,
        bibColor,
        categoryColor,
      } = getCertificateImage(entry.bibNumber);

      let certificateWindow = window.open('', 'certificateWindow');

      if (certificateWindow && !certificateWindow.closed) {
        certificateWindow.document.body.innerHTML = `
          <html>
            <head>
              <title>Certificate</title>
              <style>
                body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background-color: #f5f5f5;
                }
                .certificate {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                  background-color: white;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }
                .name {
                  position: absolute;
                  top: ${namePos.y};
                  left: ${namePos.x};
                  transform: translate(-50%, -50%);
                  font-size: 1.5rem;
                  font-family: 'Times New Roman', Times, serif; 
                  font-weight: normal;
                  color: ${nameColor}; /* Dynamic color for name */
                }
                .bib {
                  position: absolute;
                  top: ${bibPos.y};
                  left: ${bibPos.x};
                  transform: translate(-50%, -50%);
                  font-size: 3.0rem;
                  font-family: 'Times New Roman', Times, serif;
                  color: ${bibColor}; /* Dynamic color for bib number */
                }
                .category {
                  position: absolute;
                  top: ${categoryPos.y};
                  left: ${categoryPos.x};
                  transform: translate(-50%, -50%);
                  font-size: 1.5rem;
                  font-family: 'Times New Roman', Times, serif;
                  color: ${categoryColor};
                   font-weight: bold; /* Makes the text bold */}

              </style>
            </head>
            <body>
              <div class="certificate">
                <img src="${image}" alt="Certificate" style="width: 100%; height: 100%; object-fit: contain;" />
                <div class="name">${entry.firstName}</div>
                <div class="bib">${entry.bibNumber}</div>
                <div class="category">${entry.category || 'N/A'}</div>
              </div>
            </body>
          </html>
        `;
        certificateWindow.document.close();
      } else {
        alert('Unable to open or update the certificate window.');
      }
    } else {
      alert('Bib number not available');
    }
  };

  return (
    <div
      className="App h-full w-auto bg-cover bg-center flex justify-center items-center px-6 py-8 relative"
      style={{
        backgroundImage: "url('https://i.ibb.co/9p0jf8s/background.jpg')",
      }}
    >
      <div className="bg-black bg-opacity-80 p-8 rounded-lg shadow-lg w-[90%] max-w-xl h-[80vh] flex flex-col justify-center items-center text-center">
        <img
          src="https://i.ibb.co/ZcpbbSj/nova-logo.png"
          alt="Nova Logo"
          className="w-96 h-auto mb-6 mx-auto"
        />
        <div className="p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h1 className="font-bold text-white mb-6 text-3xl">Enter Bib Number</h1>
          <div className="flex justify-center mb-6">
          <input
  type="text"
  placeholder="Enter Bib Number"
  value={bibNumber}
  onChange={(e) => setBibNumber(e.target.value)}
  className="p-4 w-[80%] border border-gray-300 rounded-lg mb-4 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

          </div>
          <button
            onClick={handleSearch}
            className="bg-[#007BFF] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#0056b3] transition-all duration-200 w-60"
          >
            Search
          </button>
        </div>
      </div>
  
      <div className="absolute top-4 right-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="bg-[#007BFF] text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 cursor-pointer transition-all duration-200"
        >
          {csvUploaded ? 'CSV Uploaded' : 'Upload CSV'}
        </label>
      </div>
    </div>
  );
  
}

export default App;
