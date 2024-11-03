import {
  Container,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from "@mui/material";
import type { Excerpt } from "../excerpts/types";
import { StyledLink, StyledTableContainer } from "./styles";
import { useAppSelector } from "../../app/hooks";
import { selectAllExcerpts } from "../excerpts/excerptsSlice";
import { useEffect } from "react";

const DISPLAY_COUNT = 7;

const Home = () => {
	const excerpts = useAppSelector(selectAllExcerpts);

	useEffect(() => {
		document.title = 'Home - mylesmoylan.net'
	}, []);

	return (
		<>
			<Container sx={{ marginTop: '100px', display: 'flex', justifyContent: 'center' }}>
				<h3>Undergoing maintenance...</h3>
			</Container>
			<StyledTableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }}>
					<TableHead>
						<TableRow>
							<TableCell>Author & Work</TableCell>
							<TableCell align="right">Created</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{excerpts.slice(0, DISPLAY_COUNT).map((excerpt) => <Row key={excerpt.id} excerpt={excerpt} />)}
					</TableBody>
				</Table>
			</StyledTableContainer>
		</>
	);
};

const Row: React.FC<{ excerpt: Excerpt }> = ({ excerpt }) => {
	return (
		<>
			<TableRow
				key={excerpt.id}
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			>
				<TableCell component="th" scope="row">
					<StyledLink to={`/${excerpt.id}`}>
						{`${excerpt.author} - ${excerpt.work}`}
					</StyledLink>
				</TableCell>
				<TableCell align="right">{new Date(excerpt.createdAt).toDateString()}</TableCell>
			</TableRow>
		</>
	)
}

export default Home;
