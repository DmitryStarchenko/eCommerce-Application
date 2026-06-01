import type { ReactElement } from "react";

interface CreateCategoriesButtonProperties {
  onCategoryChange: (categoryId: string | null, categoryName: string) => void;
  currentActiveCategoryId?: string | null;
}

const CategoryIdForRequest = {
  CARS: "",
  SEDAN: "sedan-cat",
  PICKUP: "pickup-cat",
  BUS: "bus-cat",
};

export function CreateCategoriesButton({
  onCategoryChange,
  currentActiveCategoryId,
}: CreateCategoriesButtonProperties): ReactElement {
  const handleButtonClick = (
    buttonKey: keyof typeof CategoryIdForRequest,
  ): void => {
    const categoryId = CategoryIdForRequest[buttonKey];
    const categoryName = buttonKey;
    onCategoryChange(categoryId, categoryName);
  };

  const handleAllProductsClick = (): void => {
    onCategoryChange(null, "CARS");
  };

  return (
    <div className="categories-button">
      <button
        className={`button-cars button-all-cars ${
          currentActiveCategoryId === null || currentActiveCategoryId === ""
            ? "active"
            : "CARS"
        }`}
        onClick={handleAllProductsClick}
      >
        ALL CARS
      </button>
      <button
        className={`button-cars button-sedan ${
          currentActiveCategoryId === CategoryIdForRequest.SEDAN ? "active" : ""
        }`}
        onClick={() => handleButtonClick("SEDAN")}
      >
        SEDAN
      </button>
      <button
        className={`button-cars button-pickup ${
          currentActiveCategoryId === CategoryIdForRequest.PICKUP
            ? "active"
            : ""
        }`}
        onClick={() => handleButtonClick("PICKUP")}
      >
        PICKUP
      </button>
      <button
        className={`button-cars button-bus ${
          currentActiveCategoryId === CategoryIdForRequest.BUS ? "active" : ""
        }`}
        onClick={() => handleButtonClick("BUS")}
      >
        BUS
      </button>
    </div>
  );
}
