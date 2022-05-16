import styled from "styled-components";

const SAvatar = styled.div<{ lg?: boolean }>`
  width: ${(props) => (props.lg ? "30px" : "1.25rem")};
  height: ${(props) => (props.lg ? "30px" : "1.25rem")};
  border-radius: 50%;
  background-color: #2c2c2c;
`;

const Img = styled.img`
  max-width: 100%;
`;

interface AvatarUrl {
  url?: string | null;
  lg?: boolean;
}

const Avatar = ({ url = "", lg = false }: AvatarUrl) => {
  return (
    <SAvatar lg={lg}>{url && url !== "" ? <Img src={url} /> : null}</SAvatar>
  );
};

export default Avatar;
