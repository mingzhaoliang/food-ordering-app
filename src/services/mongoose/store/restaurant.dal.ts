import "server-only";

const getRestaurant = async () => {
  return Promise.resolve({ name: "Cucina Felice" });
};

export { getRestaurant };
