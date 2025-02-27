
import { useParams } from "react-router-dom";

const FormBuilder = () => {
  const { id } = useParams();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {id ? "Edit Form" : "Create New Form"}
      </h1>
      <p className="text-muted-foreground">
        Form builder functionality will be implemented here.
      </p>
    </div>
  );
};

export default FormBuilder;
