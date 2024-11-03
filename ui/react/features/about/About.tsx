import { Grid2 } from '@mui/material';
import { StyledCard, StyledContainer, StyledGrid2 } from './styles';
import { useEffect } from 'react';

const About = () => {
	useEffect(() => {
		document.title = 'About - mylesmoylan.net';
	}, []);
	return (
		<StyledContainer>
			<StyledGrid2 container spacing={0}>
				<Grid2>
					<StyledCard>
						After joining the U.S. Navy in 2005 as an engineroom technician and being stationed in Japan, an injury in 2009 led to a medical separation from the service in 2011. During rehabilitation, I began exploring my interest in computers, teaching myself to program, and studying fundamentals of computer science. This self-study continued as I pursued a bachelor's degree in computer science on the GI Bill, a journey that, despite a number of significant challenges, culminated in my graduating in December of 2023. Also, alongside my academic and professional development, over the years I've found solace in existentialism and have integrated much of the philosophy I learned from it into my life.
						<br />
						<br />
						As anyone knows, life isn't easy, and it can be hard to find encouraging words which are also substantial and meaningful enough to pick one up during dark, difficult times. Fortunately for us we are the progeny of many wise and sympathetic people who left behind little gems of advice, insight, and consolation for the trials and tribulations which are an inherent part of the human condition. That being said, I am, I suppose, somewhat of a collector of these gems, and I built this website so that I could share them with others.
					</StyledCard>
				</Grid2>
			</StyledGrid2>
		</StyledContainer>
	);
};

export default About;
