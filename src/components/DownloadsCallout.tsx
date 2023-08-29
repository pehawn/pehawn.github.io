import { Grid, IconButton, Popover, Typography, styled } from "@mui/material";
import React, { memo } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from "@mui/icons-material/Close";
import { AppContext } from "../context/AppContext";

interface IDownloadsCallout {
	open: boolean;
	anchor: any;
	closeCallout();
}

let DownloadsCallout: React.FunctionComponent<IDownloadsCallout> = ({ open, anchor, closeCallout }): JSX.Element => {
	const { Downloads } = React.useContext(AppContext);

	const ProfileDownloadsTinyText = styled(Typography)({
		fontSize: ".8rem",
		opacity: 0.7,
		fontWeight: 500,
		letterSpacing: 0.2
	});

	return (
		<React.Fragment>
			<Popover
				open={open}
				anchorEl={anchor}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
			>
				<div
					style={{
						position: "relative",
						padding: "1em 1em .5em 1em",
						verticalAlign: "center"
					}}
				>
					<div
						style={{
							position: "absolute",
							top: "0",
							right: "0"
						}}
					>
						<IconButton
							onClick={() => {
								closeCallout();
							}}
							style={{ backgroundColor: "transparent" }}
							color={"primary"}
							size="small"
						>
							<CloseIcon fontSize="inherit"></CloseIcon>
						</IconButton>
					</div>
				</div>
				<Grid container spacing={0} padding={0} alignItems={"center"}>
					<Grid item sx={{ paddingRight: "8px" }}>
						<IconButton style={{ backgroundColor: "transparent" }} color={"primary"} href={Downloads[0]} download>
							<FileDownloadIcon></FileDownloadIcon>
						</IconButton>
					</Grid>
					<Grid item sx={{ paddingRight: "8px" }}>
						<ProfileDownloadsTinyText>Beat Tape 1</ProfileDownloadsTinyText>
					</Grid>
				</Grid>
			</Popover>
		</React.Fragment>
	);
};

DownloadsCallout = memo(DownloadsCallout);

export default DownloadsCallout;
