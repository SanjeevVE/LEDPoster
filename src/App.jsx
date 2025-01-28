import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './app.css';

function App() {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState('Times');
  const [textColor, setTextColor] = useState('#000000');

  const imageUrl = 'https://i.ibb.co/MgSB590/certificate.png';

  const generatePdf = async () => {
    const pdf = new jsPDF();
    const img = new Image();
    img.src = imageUrl;

    img.onload = async () => {
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (img.height * imgWidth) / img.width;

      pdf.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);

      // Add the custom font to jsPDF
      pdf.addFileToVFS('Times.ttf', 'base64-encoded-string-here');
      pdf.addFont('Times.ttf', 'Times', 'normal');
      pdf.setFont('Times');

      pdf.setFontSize(fontSize);
      pdf.setTextColor(textColor);
      pdf.text(
        text || 'Your Text Here',
        pdf.internal.pageSize.getWidth() / 2,
        imgHeight * 0.5,
        { align: 'center', baseline: 'middle' }
      );

      pdf.save('download.pdf');

      try {
        const getISTDate = () => {
          const now = new Date();
          const istOffset = 5.5 * 60 * 60 * 1000; 
          const istDate = new Date(now.getTime() + istOffset);
          return istDate.toISOString();
        };

        const docRef = await addDoc(collection(db, 'certificates'), {
          name: text || 'Unnamed',
          createdAt: getISTDate(),
        });

        console.log('Document written with ID: ', docRef.id);
      } catch (e) {
        console.error('Error adding document: ', e);
      }
    };

    img.onerror = () => {
      console.error('Failed to load the image');
    };
  };

  return (
    <div className="App text-center mt-20">
      <h1 className="text-2xl font-bold pb-5">Generate Certificate</h1>

      <input
        type="text"
        placeholder="Enter your text here"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4"
        maxLength={30}
      />

      <div className="mb-4">
        <label className="mr-2">Select Font Size:</label>
        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded"
        >
          <option value={24}>24</option>
          <option value={32}>32</option>
          <option value={40}>40</option>
          <option value={48}>48</option>
          <option value={56}>56</option>
          <option value={64}>64</option>
        </select>
      </div>

      <button
        onClick={generatePdf}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Download as PDF
      </button>

      <div id="capture" className="relative flex flex-col items-center mt-5">
        <img
          src={imageUrl}
          alt="Certificate Background"
          className="mb-3"
          style={{ maxWidth: '50%', height: 'auto' }}
        />
        <h2
          className="font-semibold absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: textColor,
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
          }}
        >
          {text}
        </h2>
      </div>
    </div>
  );
}

export default App;