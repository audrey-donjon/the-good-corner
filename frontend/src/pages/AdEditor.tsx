import { useEffect, useState } from "react";
import { AdType, CategoryType, TagType } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryEditor } from "../components/CategoryEditor";
import { TagEditor } from "../components/TagEditor";
import { useMutation, useQuery } from "@apollo/client";
import { queryCategories } from "../api/categories";
import { queryTags } from "../api/tags";
import { queryAd } from "../api/ad";
import { queryAds } from "../api/ads";
import { mutationCreateAd } from "../api/createAd";
import { mutationUpdateAd } from "../api/updateAd";

export function AdEditorPage() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = params.id && Number(params.id);

  const { data } = useQuery<{ad: AdType}>(queryAd, { 
    variables: { 
      id 
    },
    skip: !id
  });
  const ad = data?.ad;

  const [error, setError] = useState<string>();

  const [title, setTitle] = useState("Super vélo 2");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("Paris");
  const [picture, setPicture] = useState("https://cdn.pixabay.com/photo/2019/03/11/04/47/folding-4047804_1280.jpg");
  const [owner, setOwner] = useState("alice@gmail.com");
  const [categoryId, setCategoryId] = useState<number>();
  const [tagsIds, setTagsIds] = useState<number[]>([]);

  useEffect(() => {
    if (ad) {
      // Mode édition : charger les données de l'annonce existante
      setTitle(ad.title);
      setDescription(ad.description);
      setPrice(ad.price);
      setLocation(ad.location);
      setPicture(ad.picture);
      setOwner(ad.owner);
      setCategoryId(ad.category?.id);

      const tagsIds: number[] = ad.tags.map((tag) => tag.id); // Récupérer les IDs des tags
      setTagsIds(tagsIds);
    } else {
      // Mode création : réinitialiser les champs
      setTitle("");
      setDescription("");
      setPrice(0);
      setLocation("Paris");
      setPicture("");
      setOwner("");
      setCategoryId(undefined);
      setTagsIds([]); // Réinitialiser les tags
    }
  }, [ad, id]);

  const { data: categoriesData } = useQuery<{ categories: CategoryType[] }>(
    queryCategories
  );
  const categories = categoriesData?.categories;
  useEffect(() => {
    if (categories && categories.length && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  const { data: tagsData} = useQuery<{ tags: TagType[] }>(
    queryTags
  );
  const tags = tagsData?.tags;

  const [doCreateAd, { loading: createLoading }] = useMutation<{
    createAd: AdType;
  }>(mutationCreateAd,{
    refetchQueries: [queryAds],
  });

  const [doUpdateAd, { loading: UpdateLoading }] = useMutation<{
    updateAd: AdType;
  }>(mutationUpdateAd, {
    refetchQueries: [queryAds, queryAd],
  });

  const loading = createLoading || UpdateLoading;

  async function doSubmit() {
    setError(undefined);
    try {
      if (ad) {
        const { data } = await doUpdateAd({
          variables:{
            id: ad.id,
            data: {
            title,
            description,
            price,
            location,
            picture,
            owner,
            category: categoryId ? { id: categoryId } : null,
            tags: tagsIds.map((id) => ({ id })),
          }
        }
      });
        navigate(`/ads/${data?.updateAd.id}`, { replace: true });
      } else {
        const { data } = await doCreateAd({
          variables:{
            data: {
              title,
              description,
              price,
              location,
              picture,
              owner,
              category: categoryId ? { id: categoryId } : null,
              tags: tagsIds.map((id) => ({ id })),
            }
          }
        });
        navigate(`/ads/${data?.createAd.id}`, { replace: true });
      }
    } catch (err) {
      console.error(err);
      // err.response.data[0].constraint
      setError("Une erreur est survenue");
    }
  }

  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [showTagEditor, setShowTagEditor] = useState(false);

  if (id && !ad) {
    return <p>Chargement</p>;
  }

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          doSubmit();
        }}
      >
        <label>
          Titre * :
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Prix :
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Description :
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Localisation :
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <br />
        <label>
          Image (URL) :
          <input
            type="text"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
          />
        </label>
        <br />
        <label>
          Auteur :
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
        </label>
        <br />
        <label>
          Catégorie :
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {categories?.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            setShowCategoryEditor(!showCategoryEditor);
          }}
        >
          {showCategoryEditor === true ? "Cacher" : "Nouvelle catégorie"}
        </button>
        {showCategoryEditor && (
          <CategoryEditor
            onCategoryCreated={async (id) => {
              setShowCategoryEditor(false);
              // await fetchCategories();
              setCategoryId(id);
            }}
          />
        )}
        <br />
        <div>
          Tags :
          {tags?.map((tag) => (
            <label key={tag.id}>
              <input
                type="checkbox"
                checked={tagsIds.includes(tag.id) === true}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTagsIds([...tagsIds, tag.id]);
                  } else {
                    setTagsIds(tagsIds.filter((entry) => entry !== tag.id));
                  }
                }}
              />
              {tag.name}
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setShowTagEditor(!showTagEditor);
          }}
        >
          {showTagEditor === true ? "Cacher" : "Nouveau tag"}
        </button>
        {showTagEditor && (
          <TagEditor
            onTagCreated={async (id) => {
              setShowTagEditor(false);
              // await fetchTags();
              tagsIds.push(id);
              setTagsIds([...tagsIds]);
            }}
          />
        )}
        <br />
        <br />
        <button>{ad ? "Modifier mon annonce" : "Créer mon annonce"}</button>
        {loading === true && <p>Chargement...</p>}
      </form>
    </div>
  );
}
