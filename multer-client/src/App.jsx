import axios from "axios";
import { useEffect, useState } from "react"


function App() {
  const [file, setFile] = useState()
  const [img, setImg] = useState()
  console.log(img);
  const upload = (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append('file', file);
    console.log(file);

    axios.post('http://localhost:5000/upload', formData)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.error(err);
      });
  }

 useEffect(()=>{
         axios.get('http://localhost:5000/upload')
         .then(res => setImg(res.data.filename))
         .catch(err => {console.error(err);})
 },[]);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={upload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn bg-black text-white rounded-md p-1" type="submit">Upload</button>
      </form>
      <div>
        <p>Image</p>
        <img className="w-40 h-40" src={`http://localhost:5000/images/${img}`} alt="" />
      </div>
    </div>
  )
}

export default App;