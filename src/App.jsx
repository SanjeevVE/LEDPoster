import React, { useState } from 'react';
import Papa from 'papaparse';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [bibNumber, setBibNumber] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [csvUploaded, setCsvUploaded] = useState(false);

  const getCertificateImage = (bib) => {
    if (bib >= 1 && bib <= 20000) {
      return {
        image: 'https://i.ibb.co/LXLZsP6g/10km-new.jpg',
        namePos: { x: '72%', y: '29%' },
        bibPos: { x: '72%', y: '22%' },
        nameColor: 'white',
        bibColor: 'white',
      };
    }

    throw new Error('Error: Check your bib number');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log('CSV headers:', result.meta.fields);
        console.log('First row sample:', result.data[0]);

        const processedData = result.data.map((row) => {
          const bibField =
            row.bibNumber || row.BibNumber || row.bib || row.Bib || row.BIB;
          return {
            ...row,
            bibNumber: bibField,
          };
        });

        setData(processedData);
        setCsvUploaded(true);
      },
    });
  };

  const handleSearch = () => {
    console.log('Searching for bib number:', bibNumber);
    console.log('Available data:', data);

    const entry = data.find(
      (row) => String(row.bibNumber).trim() === String(bibNumber).trim()
    );
    setSelectedEntry(entry || null);
    if (entry) {
      const { image, namePos, bibPos, nameColor, bibColor } =
        getCertificateImage(entry.bibNumber);

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
                  width: 100vw;                 
                  overflow: hidden;
                  background-color: white;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }
                .name {
                  position: absolute;
                  top: ${namePos.y};
                  left: ${namePos.x};
                  transform: translate(-50%, -50%);
                  font-size: 2.5rem;
                  font-family: 'Arial Black', Arial, sans-serif;
                  font-weight: normal;
                  color: ${nameColor}; /* Dynamic color for name */
                }
                .bib {
                  position: absolute;
                    top: ${bibPos.y};
                  left: ${bibPos.x};
                  transform: translate(-50%, -50%);
                  font-size: 7.0rem;
                  font-family: 'Arial Black', Arial, sans-serif;
                  color: ${bibColor}; /* Dynamic color for bib number */
                }
                  
              </style>
            </head>
            <body>
              <div class="certificate">
                <img src="${image}" alt="Certificate" style="width: 100%; height: 100%; object-fit: contain;" />
                <div class="name">${entry.firstName}</div>
                <div class="bib">${entry.bibNumber}</div>
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
      className='App h-full w-full flex justify-center items-center px-6 py-8 relative'
      style={{
        background:
          'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7F7FD5 100%)',
        width: '100vw',
        height: '100vh',
      }}
    >
      <div className='bg-black bg-opacity-80 p-8 rounded-lg shadow-lg w-[90%] max-w-xl h-[90vh] flex flex-col justify-center items-center text-center'>
        <div className='relative'>
          <div className='absolute inset-0 rounded-[200px] bg-gradient-to-r from-white to-gray-200 blur-xl opacity-50'></div>
          <img
            src='https://i.ibb.co/ZcpbbSj/nova-logo.png'
            alt='Nova Logo'
            className='w-96 h-auto mb-6 mx-auto relative z-10'
          />
        </div>
        <div className='p-8 rounded-lg shadow-lg w-full max-w-md text-center'>
          <h1 className='text-white mb-6 text-3xl'>Enter Bib Number</h1>
          <div className='flex justify-center mb-6'>
            <input
              type='text'
              placeholder=''
              value={bibNumber}
              onChange={(e) => setBibNumber(e.target.value)}
              className='p-4 w-[80%] border border-gray-300 rounded-lg mb-4 text-3xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            className='bg-[#007BFF] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#0056b3] transition-all duration-200 w-60'
          >
            Search
          </button>
        </div>
      </div>

      <div className='absolute top-4 right-4'>
        <input
          type='file'
          accept='.csv'
          onChange={handleFileUpload}
          className='hidden'
          id='fileUpload'
        />
        <label
          htmlFor='fileUpload'
          className={`px-6 py-3 rounded-md font-semibold shadow-md cursor-pointer transition-all duration-200 ${
            csvUploaded
              ? 'bg-[#C7CC00] hover:bg-[#AEB300]'
              : 'bg-[#007BFF] hover:bg-blue-600 text-white'
          }`}
        >
          {csvUploaded ? 'CSV Uploaded' : 'Upload CSV'}
        </label>
      </div>
    </div>
  );
}

export default App;
