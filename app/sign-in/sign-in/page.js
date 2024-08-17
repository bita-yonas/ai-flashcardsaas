import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';

export default function SignUpPage() {
    return (
        <>
            <AppBar position="static" >
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Flashcard Saas
                    </Typography>
                    <Button color="inherit">
                        <Link href="/login" passHref>
                            Login
                        </Link>
                    </Button>
                    <Button color="inherit">
                        <Link href="/signin" passHref>
                            Sign Up
                        </Link>
                    </Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    mt={2}
                >
                    <Typography variant="h4">Sign In</Typography>
                    <SignIn routing="hash" signUpUrl="/sign-in" />
                </Box>
            </Container>
        </>
    );
}