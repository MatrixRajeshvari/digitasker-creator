
import { useParams } from "react-router-dom";

const FormResponses = () => {
  const { id } = useParams();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Form Responses</h1>
      <p className="text-muted-foreground">
        Form responses for form ID: {id} will be displayed here.
      </p>
    </div>
  );
};

export default FormResponses;
