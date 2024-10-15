import { HomeLoggedOut } from "./home-logged-out";
import { HomeLoggedIn } from "./home-logged-in";
import Footer from "../ui/footer";

export function Home() {
    const token = localStorage.getItem('token');

    return (
        <>
            {token ? <HomeLoggedIn /> : <HomeLoggedOut />}

            <Footer />

        </>
    );
}
