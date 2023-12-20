'use client';

import MovieDetails from "@/components/MovieDetails";
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

const Details = ({params}: { params: { movieId: string } }) => {
    return (
        <>
            <MovieDetails movieId={params}/>
        </>
    )
} 

export default withPageAuthRequired(Details);