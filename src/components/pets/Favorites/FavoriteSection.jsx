import { useEffect, useState } from "react";
import { useDelete, useInsert } from "react-supabase";

import { useAuth } from "../../../context/SupaContext";
import FavoriteButton from "../../layout/FavoriteButton";

const FavoriteSection = ({ id }) => {
  const [{ fetching }, execute] = useInsert("favoritepets");
  const { user, session, favoritePets, addNewFav, removeFavoritePet } =
    useAuth();
  const [status, setStatus] = useState(false);
  const [removalId, setRemovalId] = useState(0);
  if (!session) return null;
  const [{ fetching: deleteFetching }, executeDelete] = useDelete("todos");
  const addFav = async (petId) => {
    const { data } = await execute({
      favoriter: user.id,
      pet: petId,
    });
    addNewFav(data[0]);
  };

  const removeFav = async () => {
    await executeDelete((query) => query.eq("id", removalId), {
      returning: "minimal",
      count: "estimated",
    });
    removeFavoritePet(removalId);
  };
  useEffect(() => {
    const checkFav = favoritePets.some((el) => el.pet === id);
    if (checkFav) {
      setStatus(true);
      setRemovalId(favoritePets.find((fav) => fav.pet === id).id);
    } else {
      setStatus(false);
      setRemovalId(0);
    }
  }, [id, favoritePets]);

  return (
    <FavoriteButton
      loading={fetching || deleteFetching}
      add={() => addFav(id)}
      remove={removeFav}
      status={status}
    />
  );
};
export default FavoriteSection;