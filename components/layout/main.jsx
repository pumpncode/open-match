/**
 *
 * @param props
 * @param props.children
 */
const Main = ({ children }) => (
	<main className="z-0 flex flex-col w-full text-white grow shrink-0 bg-neutral-800 p-8">
		{children}
	</main>
);

export default Main;
