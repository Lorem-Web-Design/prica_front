import Grid from "../components/grid";
import Layout from "../components/layout";
import { useEffect, useState } from "react";
import { useAuth } from "../customHooks/centers/auth/useAuth";
import { postDataNoToken } from "../api/fetchData";
import { dataSource } from "../api/datasources";

export default function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [isValid, setIsValid] = useState<undefined | boolean >(undefined);
    let serverReseponse = <p></p>
    /*@ts-ignore*/  
    const {login} = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let myForm = new FormData();
        myForm.append("userInfo", JSON.stringify({name, password}));
        try{
          const result = await postDataNoToken(`${dataSource()}/user/login`, myForm);
          const parsedData = await result.json();
          if(result.status === 200){
            login(parsedData);
          }
          
          if(result.status === 401){
            setIsValid(true);
            serverReseponse = <p style={{color: 'ff0000'}}>Usuario o contraseña inválidos</p>
          }
          
        }
        catch(err){
          console.error(err);
        }
    }

    return (
        <Layout>
            <Grid def={3} sm={3} md={3} lg={3} gap={12} className="">
                <div></div>
                <form className="login_container" onSubmit={handleSubmit}>
                    <div className="input_container" style={{paddingBottom: 12}}>
                        <label htmlFor="name">Nombre de usuario</label>
                        <input type="text" placeholder="Nombre de usuario" value={name} onChange={(e)=>setName(e.target.value)} name="name"/>
                    </div>
                    <div className="input_container" style={{paddingBottom: 12}}>
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" placeholder="Contraseña" value={password} name="password"  onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                    <div className="input_container">
                        <button className="mediumBottom" type="submit">Iniciar sesión</button>
                    </div>
                    <div className="input_container">
                        {isValid === undefined ? <p></p> : isValid ? <p style={{color:'red', fontWeight: 'bold', paddingTop: 16}}>Usuario o contraseña inválidos...</p> : <p></p>}
                    </div>
                </form>
                <div></div>
            </Grid>
        </Layout>
      )
}
