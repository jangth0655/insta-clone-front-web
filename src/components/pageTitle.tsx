import { Helmet } from "react-helmet-async";

interface PageTitleProp {
  title: string;
}

const PageTitle: React.FC<PageTitleProp> = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | Insta</title>
    </Helmet>
  );
};

export default PageTitle;
