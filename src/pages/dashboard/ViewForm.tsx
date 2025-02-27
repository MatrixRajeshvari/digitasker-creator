
import { useParams } from "react-router-dom";

const ViewForm = () => {
  const { id } = useParams();
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">View Form</h1>
      <p className="text-muted-foreground">
        Public view of form ID: {id} will be displayed here.
      </p>
    </div>
  );
};

export default ViewForm;
