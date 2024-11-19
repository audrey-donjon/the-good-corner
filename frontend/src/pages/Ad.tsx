import { useNavigate, useParams } from "react-router-dom";
import { AdType } from "../types";
import { useQuery, useMutation } from "@apollo/client";
import { queryAd } from "../api/ad";
import { queryAds } from "../api/ads";
import { mutationDeleteAd } from "../api/deleteAd";


export function AdPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data } = useQuery<{ad: AdType}>(queryAd, { 
    variables: { 
      id 
    } 
  });
  const ad = data?.ad;

  const [doDelete] = useMutation(mutationDeleteAd, {
    refetchQueries: [queryAds],
  });
  async function onDelete() {
    try {
      await doDelete({
        variables: {
          id,
        },
      });
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
    }
  }

  function onUpdate() {
    navigate(`/ads/${id}/edit`);
  }

  if (ad === undefined) {
    return <p>Chargement</p>;
  }

  return (
    <>
    <div className="ad-info-container">
    <h1>{ad.title}</h1>
    <div>
      {ad.picture ? <img src={ad.picture} alt=""/> : <p>Aucune image à afficher</p>}
    </div>
    <div>
      <h2>Description</h2>
      {ad.description === "" ? (<p>Aucune description à afficher</p>
      ) : (
      <p>{ad.description}</p>
      )}
    </div>
    <div>
      <h2>Prix</h2>
      <p>{(ad.price / 100).toFixed(2)} €</p>
    </div>
    <div>
      <h2>Localisation</h2>
      {ad.location ? <p>{ad.location}</p> : <p>Aucune localisation à afficher</p>}
    </div>
    <div>
      <h2>Vendeur</h2>
      {ad.owner ? <p>{ad.owner}</p> : <p>Aucun vendeur à afficher</p>}
    </div>
    <div>
      <h2>Catégorie</h2>
      {ad.category ? <p>{ad.category.name}</p> : <p>Aucune catégorie à afficher</p>}
    </div>
    <div>
      <h2>Tags</h2>
      {ad.tags === null || ad.tags === undefined || ad.tags.length === 0 ? (<div><p>Aucun tags à afficher</p></div>
      ) : (
        <div>
          <ul>
            {ad.tags.map((tag,index) => (
              <li key={index}>{tag.name}</li>
            ))}
          </ul>
        </div>
          
      )}
    </div>
    <button onClick={onDelete} className="button button-form button-delete">Supprimer l'annonce</button>
    <button onClick={onUpdate}>Modifier l'offre</button>
  </div>
  </>
  );
}

