import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useEditProducer from "../CustomHooks/ProducerHooks/useEditProducer";
import { zodResolver } from "@hookform/resolvers/zod";
const schema = z.object({
  nameProducer: z.string().min(3).max(100),
});

function FormElementEditProducer({ producer }) {
  ///producer:idProducer, nameProducer

  const initialName = producer.nameProducer;
  const idProducer = producer.idProducer;
  const onEdit = useEditProducer();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { nameProducer: initialName },
  });

  const onSubmit = async (data) => {
    try {
      await onEdit(idProducer, data);
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  };

  return (
    <>
      <form id="style-form" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Name"
          {...register("nameProducer", { required: true })}
        ></input>
        {errors.nameProducer && <div>{errors.nameProducer.message}</div>}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
        {errors.root && <div>{errors.root.message}</div>}
      </form>
    </>
  );
}

FormElementEditProducer.propTypes = {
  producer: PropTypes.shape({
    idProducer: PropTypes.number.isRequired,
    nameProducer: PropTypes.string.isRequired,
    // Add more PropTypes as per the structure of producer object
  }).isRequired,
};

export default FormElementEditProducer;
