import React, { useState } from 'react';
import { baseURL } from '../../../config';
import { Spin, message } from 'antd';

function UploadForm() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch(`${baseURL}/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        response.json();
        setLoading(false);
        message.success('Upload success');
    })
      .then((data) => console.log(data))
      .catch((error) => {console.error(error);
      setLoading(false);
      message.error('Upload failed');});
  };
    const handleDownload = () => {
      const filename = selectedFile; // replace with the filename of the file to download
      console.log("XXX: ",filename.name)
      window.open(`${baseURL}/download/${filename.name}`);
    };
  
  return (
    <div>
    <Spin spinning={loading} tip="Uploading...">
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
    <button onClick={handleDownload}>Download</button>
    </Spin>
    </div>
  );
}

export default UploadForm;