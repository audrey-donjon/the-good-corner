import { useMutation } from "@apollo/client";
import { useState } from "react";
import { mutationCreateUser } from "../api/createUser";

export function SignupPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [doCreateUser, { loading, data }] = useMutation(mutationCreateUser);

    async function doSubmit() {
        try{
            await doCreateUser({
                variables: {
                    data: {
                        email,
                        password,
                    },
                },
            });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(e: any){
            console.error(e);
            if(e.message.includes(`Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`)){
                setError("Le mot de passe n'est pas assez fort");
            } else if(e.message.includes("email must be an email")){
                setError("L'email doit être une adresse email valide");
            } else{
                setError("Un compte avec cette adresse email existe déjà");
            }
        }
    }

    if(data){
        return(
            <div>
                <h2>Inscription</h2>
                <p>Inscription réussie 🎉 <br />Vous pouvez maintenant vous connecter.</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Inscription</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form
            onSubmit={(e) => {
                e.preventDefault();
                doSubmit();
            }}
            >
            <label>
            Email * :
                <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </label>
            <br />
            <label>
            Mot de passe * :
                <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </label>
            <br />
            <button>M'inscrire</button>
            {loading === true && <p>Chargement...</p>}
            </form>
        </div>
    );
}