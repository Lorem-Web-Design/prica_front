import { adminDataSource } from "../api/datasources";
import { postDataWithPayLoad } from "../api/fetchData";
import getToken from "../utils/getToken";

type ImageUploader = {
  status: number;
  path: string;
  error: boolean;
  loading: boolean;
};

export default async function multipleImageUploader(image: FormData) {
  try {
    const myResult = await postDataWithPayLoad(`${adminDataSource()}/images/multiple`, image, getToken());
    const response = await myResult.json();
    if (myResult.status === 200) {
      return(
        {
          status: 200,
          path: `images/${response.res.filename}`,
          error: false,
          loading: false,
        }
      )
    }
  } catch (err) {
    return (
      {
        status: 400,
        error: true,
        path: "",
        loading: false,
      }
    )
  }

  return(
    {
      status: 200,
      path: "",
      error: false,
      loading: true,
    }
  )
}
