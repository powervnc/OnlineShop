import { useForm } from "react-hook-form";
import { useHealthContext } from "../Contexts/ContextHealth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useAddSupply from "../CustomHooks/SupplyHooks/useAddSupplyHook";
import { storeAction } from "../LocalStoroge/localStorageUtils";
import { useSupplyContext } from "../Contexts/ContextSupply";

function FormElement() {
  const { isServerOnline } = useHealthContext();
  const { CATEGORIES, producers } = useSupplyContext();
  const addSupply = useAddSupply();
  const schema = z.object({
    nameSupply: z.string().min(3).max(100),
    priceSupply: z
      .number({
        required_error: "Price supply is required",
        invalid_type_error: "Price supply must be a number",
      })
      .min(1, "Minimum price is 1")
      .max(2000, "Maximum price is 2000"),
    nrOfSupplies: z
      .number({
        required_error: "Number of supplies is required",
        invalid_type_error: "Number of supplies must be a number",
      })
      .min(0, "Minimum number of supplies is 0"),
    nameProducer: z.string().nonempty("Producer name is required"),
    categorySupply: z.string().min(3).max(100),
    // supplyImage: z.any(), 
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nameSupply: "",
      priceSupply: 0,
      nrOfSupplies: 0,
      nameProducer: "",
      categorySupply: "",
    },
  });

  const onSubmitOnline = async (formData) => {
    try {
      await addSupply(formData);
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  };

  const onSubmit = (formData) => {
    console.log("Form data:", formData);
    console.log(isServerOnline);
    if (isServerOnline) {
      onSubmitOnline(formData);
    } else {
      storeAction("addSupply", formData);
    }
  };

  return (
    <>
      <form id="style-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Name"
          {...register("nameSupply", { required: true })}
        ></input>
        {errors.nameSupply && <div>{errors.nameSupply.message}</div>}
        <br></br>
        <select
          id="category-supply-select"
          name="categorySupply"
          {...register("categorySupply", { required: true })}
        >
          {CATEGORIES.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.categorySupply && <div>{errors.categorySupply.message}</div>}
        <br></br>
        <select
          id="name-producer-select"
          name="producer"
          {...register("nameProducer", { required: true })}
        >
          {producers.map((producer, index) => (
            <option key={index} value={producer.nameProducer}>
              {producer.nameProducer}
            </option>
          ))}
        </select>

        {errors.nameProducer && <div>{errors.nameProducer.message}</div>}
        <br></br>
        <input
          type="number"
          placeholder="Price"
          {...register("priceSupply", { required: true, valueAsNumber: true })}
        ></input>
        {errors.priceSupply && <div>{errors.priceSupply.message}</div>}
        <input
          type="number"
          placeholder="Nr. of supplies"
          {...register("nrOfSupplies", { required: true, valueAsNumber: true })}
        ></input>
        {errors.nrOfSupplies && <div>{errors.nrOfSupplies.message}</div>}
        {/* <input
          type="file"
          accept=".jpg,.jpeg,.png"
          {...register("supplyImage", { required: true })}
        />
        {errors.supplyImage && <div>{errors.supplyImage.message}</div>} */}
        <br></br>
        <button className="button-54" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
        {errors.root && <div>{errors.root.message}</div>}
      </form>
    </>
  );
}

export default FormElement;
