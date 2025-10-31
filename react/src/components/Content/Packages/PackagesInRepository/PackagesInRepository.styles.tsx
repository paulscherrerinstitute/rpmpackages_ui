import { keyframes, type SxProps, type Theme } from "@mui/material";

export const outerList: SxProps<Theme> = {
  width: "100%",
  justifyContent: "center",
};

export const titleList: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  margin: 1,
  "& > h3": {
    margin: 0,
    padding: 0,
  },
  "& > svg": {
    fontSize: "big",
    "&:hover": {
      cursor: "pointer",
    },
  },
};

export const dialogueWrapper: SxProps<Theme> = {
  "& > div": {
    padding: 3,
  },
  width: "100%",
};

export const formWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  "& > *": {
    paddingTop: 1,
    paddingBottom: 1,
  },
};

export const listItem = (
  isSelected: boolean,
  showAnimation: boolean
): SxProps<Theme> => ({
  "&:hover": {
    background: "rgba(130, 130, 130, 0.1)",
    cursor: "grab",
  },
  "&:drop": {
    background: "rgba(130, 130, 130, 1)",
  },
  borderBottom: isSelected ? "2px solid black" : "none",
  animation: showAnimation ? `${highlightFade} 5s ease-out` : "none",
  transition: showAnimation ? "background-color 5s ease-out" : "none",
  borderRadius: showAnimation ? "4px" : "",
});

export const listButtons: SxProps<Theme> = {
  display: "flex",
  "&>*": {
    marginInline: "3px",
  },
  cursor: "default",
};

const highlightFade = keyframes`
  0% {
    background-color: #9eb9c5ff;
  }
  100% {
    background-color: transparent;
  }
`;

export const highlightSx: SxProps<Theme> = () => ({
  animation: `${highlightFade} 5s ease-out`,
  transition: "background-color 5s ease-out",
  borderRadius: "4px",
});

export const body: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  padding: 1,
  width: "95vw",
  overflowX: "clip",
};

export const searchWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "end",
  "& > svg": {
    marginInlineStart: 2,
  },
};

export const subtitleTitleWrapper: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  "& > svg": {
    marginInline: 1,
  },
};
