import React, { useState } from 'react';
import classes from './upload.module.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AiOutlineFileImage } from 'react-icons/ai';

const Upload = () => {
  const [state, setState] = useState({
    title: '',
    desc: '',
    location: '',
  });
  const [photo, setPhoto] = useState(null);
  const { token } = useSelector((state) => state.auth);
  console.log('token',token);
  const navigate = useNavigate();

  const handleState = (e) => {
    const { name, value } = e.target;
    setState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      let filename = null;

      // Upload image if selected
      if (photo) {
        const formData = new FormData();
        filename = crypto.randomUUID() + photo.name;
        formData.append('filename', filename);
        formData.append('image', photo);

        await fetch(`http://localhost:5000/upload/image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      // Create post
      const res = await fetch(`http://localhost:5000/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...state,
          photo: filename,
        }),
      });

      if (!res.ok) throw new Error('Failed to create post');

      const data = await res.json();
      console.log("Post created:", data);
      navigate('/');
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2>Upload Post</h2>
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            name="title"
            placeholder="Title..."
            onChange={handleState}
            value={state.title}
          />
          <input
            type="text"
            name="desc"
            placeholder="Description..."
            onChange={handleState}
            value={state.desc}
          />
          <label htmlFor="photo">
            Upload photo <AiOutlineFileImage />
          </label>
          <input
            type="file"
            id="photo"
            style={{ display: 'none' }}
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <input
            type="text"
            name="location"
            placeholder="Location..."
            onChange={handleState}
            value={state.location}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
