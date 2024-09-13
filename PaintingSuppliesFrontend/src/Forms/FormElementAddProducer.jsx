import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAddProducer from "../CustomHooks/ProducerHooks/useAddProducer";

function FormElementAddProducer() {
  const addProducer = useAddProducer();
  const schema = z.object({
    nameProducer: z.string().min(3).max(100),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    try {
      console.log(formData);
      await addProducer(formData);
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  };

  return (
    <>
      <form id="style-form" className="my-24" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Name"
          {...register("nameProducer")}
        ></input>
        {errors.nameProducer && <div>{errors.nameProducer.message}</div>}
        <button className="button-54" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
        {errors.root && <div>{errors.root.message}</div>}
      </form>
    </>
  );
}

export default FormElementAddProducer;
