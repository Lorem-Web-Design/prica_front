import { postDataWithPayLoad } from "../api/fetchData";
import { adminDataSource, dataSource } from "../api/datasources";
import getToken from "../utils/getToken";
import ELEMENT_IMAGE from "../assets/images/no_image.jpg";
import { useState } from "react";

type InputImage = {
    setFile: React.Dispatch<React.SetStateAction<string | File>>
}

export default function InputImage({ setFile}: InputImage) {
    const [visualImage, setVisualImage] = useState<string>(ELEMENT_IMAGE);

  const handleImage = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files;
    if (file !== null) {
        setVisualImage(URL.createObjectURL(file[0]));
        setFile(file[0]);
    }
  };

  return (
    <div className="user_image_container">
      <div className="user_image">
        <img src={visualImage} alt="Element image" />
      </div>
      <input type="file" onChange={handleImage} />
      <div style={{ paddingTop: 12 }}>
        <label htmlFor="image" className="mediumBottom input_container">
          Añadir Imagen
        </label>
        <input type="file" onChange={handleImage} id="image" name="image"/>
      </div>
    </div>
  );
}
