import IntroBanner from "../components/IntroBanner";
import CourseGrid from "../components/CourseGrid";

function Home() {
    return (
        <>
            <IntroBanner
                title="Vamos começar, escolha as opções do seu curso"
                subtitle="Use os filtros para saber o preço do seu curso e fazer sua inscrição."
            />
            <CourseGrid />
        </>
    );
}

export default Home;
