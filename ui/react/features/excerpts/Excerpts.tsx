import { useEffect, useRef, useState } from "react";
import {
	Card,
	CardContent,
	CircularProgress,
	Container,
	Grid2,
	Typography
} from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { selectExcerptById, selectExcerptIds } from "./excerptsSlice";
import Markdown from "react-markdown";

const CHUNK_SIZE = 12;

const Excerpts = () => {
	useEffect(() => {
		document.title = 'Excerpts - mylesmoylan.net'
	}, []);

	return (
		<>
			<FilterForm />
			<List />
		</>
	)
}

const FilterForm = () => {
	return (
		<>

		</>
	);
};

const List = () => {
	const excerptIds = useAppSelector(selectExcerptIds);

	const [displayCount, setDisplayCount] = useState(CHUNK_SIZE);
	const loadMoreRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				setDisplayCount(prevCount => Math.min(prevCount + CHUNK_SIZE, excerptIds.length));
			}
		}, {
				rootMargin: '500px'
		});

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => {
			if (loadMoreRef.current) {
				observer.unobserve(loadMoreRef.current);
			}
		}
	}, [excerptIds]);

	return (
		<>
			<Grid2 container sx={{ my: 10, justifyContent: 'center' }} rowSpacing={3}>
				{excerptIds.slice(0, displayCount).map((excerptId) => {
					return (
						<Grid2 key={excerptId}>
							<Item excerptId={excerptId} />
						</Grid2>
					);
				})}
				{displayCount < excerptIds.length && <CircularProgress ref={loadMoreRef} />}
			</Grid2>
		</>
	);
};

const Item: React.FC<{ excerptId: number }> = ({ excerptId }) => {
	const excerpt = useAppSelector((state) => selectExcerptById(state, excerptId));
	
	return (
		<Container maxWidth='md'>
			<Card sx={{
				p: 2,
				mx: 3,
				display: 'flex',
				justifyContent: 'center',
			}}>
				<CardContent>
					<Typography sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
						{excerpt?.author}
						<br />
						{excerpt?.work}
					</Typography>
					<Markdown>
						{excerpt?.body}
					</Markdown>
				</CardContent>
			</Card>
		</Container>
	);
};

export default Excerpts;
