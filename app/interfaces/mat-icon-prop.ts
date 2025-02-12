import * as MuiIcons from "@mui/icons-material";

type IconName = keyof typeof MuiIcons;
export default interface MatIconProp {
    icon:IconName
}