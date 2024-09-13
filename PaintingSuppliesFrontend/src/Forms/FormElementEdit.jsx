import PropTypes from "prop-types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useEditSupply from "../CustomHooks/SupplyHooks/useEditSupply";
import { useSupplyContext } from "../Contexts/ContextSupply";
function FormElementEdit(props) {
  const item = props.item;
  const idSupply = item.idSupply;
  const onEdit = useEditSupply();
  const {CATEGORIES, producers} = useSupplyContext();
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
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nameSupply: item.nameSupply,
      priceSupply: item.priceSupply,
      descriptionSupply: item.descriptionSupply,
      nrOfSupplies: item.nrOfSupplies,
      nameProducer: item.nameProducer,
      categorySupply: item.categorySupply,
    },
  });

  const onSubmit = async (formData) => {
    try {
      await onEdit(idSupply, formData);
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  };

  // useEffect(() => {
  //   if (socket) {
  //     const handleNewProducers = (event) => {
  //       const newListProducers = event;
  //       setListProducers(newListProducers);
  //     };
  //     socket.on("changedTheProducers", handleNewProducers);

  //     return () => {
  //       socket.off("changedTheProducers", handleNewProducers);
  //     };
  //   }
  // }, [socket]);

  return (
    <>
      <form id="style-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            id="name-supply-input"
            type="text"
            placeholder="Enter name"
            {...register("nameSupply", { required: true })}
          ></input>
        </div>
        {errors.nameSupply && <div>{errors.nameSupply.message}</div>}

        <div>
          <select
            id="category-supply-select"
            name="categorySupply"
            {...register("categorySupply", { required: true })}
          >
            <option value="" disabled>Select category</option>
            {CATEGORIES.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {errors.categorySupply && <div>{errors.categorySupply.message}</div>}

        <div>
          <select
            id="name-producer-select"
            name="nameProducer"
            {...register("nameProducer", { required: true })}
          >
            <option value="" disabled>Select producer</option>
            {producers.map((producer, index) => (
              <option key={index} value={producer.nameProducer}>
                {producer.nameProducer}
              </option>
            ))}
          </select>
        </div>
        {errors.nameProducer && <div>{errors.nameProducer.message}</div>}

        <div>
          <input
            id="price-supply-input"
            type="number"
            placeholder="Enter price"
            {...register("priceSupply", { valueAsNumber: true })}
          ></input>
        </div>
        {errors.priceSupply && <div>{errors.priceSupply.message}</div>}

        <div>
          <input
            id="description-supply-input"
            type="text"
            placeholder="Enter description"
            {...register("descriptionSupply")}
          ></input>
        </div>
        {errors.descriptionSupply && (
          <div>{errors.descriptionSupply.message}</div>
        )}

        <div>
          <input
            id="nrOfSupplies-input"
            type="number"
            placeholder="Enter number of supplies"
            {...register("nrOfSupplies", { valueAsNumber: true })}
          ></input>
        </div>
        {errors.nrOfSupplies && <div>{errors.nrOfSupplies.message}</div>}

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
        {errors.root && <div>{errors.root.message}</div>}
      </form>
    </>
  );
}


FormElementEdit.propTypes = {
  item: PropTypes.shape({
    idSupply: PropTypes.number.isRequired,
    nameSupply: PropTypes.string.isRequired,
    priceSupply: PropTypes.number.isRequired,
    descriptionSupply: PropTypes.string,
    nrOfSupplies: PropTypes.number.isRequired,
    nameProducer: PropTypes.string.isRequired,
    categorySupply: PropTypes.string.isRequired,
  }).isRequired,
};


export default FormElementEdit;
