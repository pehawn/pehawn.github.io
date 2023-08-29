import { IconButton, Popover, Stack, Typography, styled } from "@mui/material";
import React, { memo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

interface IProfileCallout {
	open: boolean;
	anchor: any;
	closeCallout();
}

let ProfileCallout: React.FunctionComponent<IProfileCallout> = ({ open, anchor, closeCallout }): JSX.Element => {
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
				<Stack direction={"row"} alignItems={"center"} style={{ padding: "1em" }}>
					<ProfileDownloadsTinyText>Patrick Hawn / KCMO </ProfileDownloadsTinyText>
					<IconButton style={{ paddingLeft: "10px", backgroundColor: "transparent" }} target="_blank" href="https://www.linkedin.com/in/patrick-hawn-74717381/" size="small">
						<LinkedInIcon color="info" fontSize="inherit"></LinkedInIcon>
					</IconButton>
					<IconButton style={{ backgroundColor: "transparent" }} target="_blank" href="https://www.instagram.com" size="small">
						<InstagramIcon color="info" fontSize="inherit"></InstagramIcon>
					</IconButton>
				</Stack>
			</Popover>
		</React.Fragment>
	);
};

ProfileCallout = memo(ProfileCallout);

export default ProfileCallout;
