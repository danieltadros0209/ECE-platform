import Link from "next/link";

const HomePage = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">ECE Stipend Application</h1>
      <p className="lead">
        Apply for an Early Childhood Education stipend or grant.
      </p>
      <Link href="/apply" className="btn btn-primary">
        Start Application
      </Link>
    </div>
  );
};

export default HomePage;
