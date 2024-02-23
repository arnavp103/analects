import type { APIContext, InferGetStaticPropsType } from "astro";
import satori, { type SatoriOptions } from "satori";
import { html } from "satori-html";
import { Resvg } from "@resvg/resvg-js";
import { siteConfig } from "@/site-config";
import { getAllPosts, getFormattedDate } from "@/utils";

import RobotoMono from "@/assets/roboto-mono-regular.ttf";
import RobotoMonoBold from "@/assets/roboto-mono-700.ttf";

const ogOptions: SatoriOptions = {
	width: 1200,
	height: 630,
	// debug: true,
	fonts: [
		{
			name: "Roboto Mono",
			data: Buffer.from(RobotoMono),
			weight: 400,
			style: "normal",
		},
		{
			name: "Roboto Mono",
			data: Buffer.from(RobotoMonoBold),
			weight: 700,
			style: "normal",
		},
	],
};

const markup = (title: string, pubDate: string) =>
	html`<div tw="flex flex-col w-full h-full bg-[#12369a] text-[#c9cacc]">
		<div tw="flex flex-col flex-1 w-full p-10 justify-center">
			<p tw="text-2xl mb-6 text-gray400">${pubDate}</p>
			<h1 tw="text-6xl font-bold leading-snug text-white">${title}</h1>
		</div>
		<div tw="flex items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
			<div tw="flex items-center">
				<svg width="80" height="100" viewBox="0 0 864 1076" fill="none" xmlns="http://www.w3.org/2000/svg">
					<line x1="1.80059" y1="542.539" x2="861.456" y2="541.549" stroke="black" stroke-width="5"/>
					<path d="M2.54089 543.458L428.275 106.807V0.374023" stroke="black" stroke-width="5"/>
					<path d="M862.197 540.729L433.733 977.379V1075.63" stroke="black" stroke-width="5"/>
					<path d="M74.7217 540.729L428.275 187.176L781.829 540.729L428.275 894.282L74.7217 540.729Z" fill="#AF0DE8"/>
					<line x1="108.309" y1="574.316" x2="461.863" y2="220.763" stroke="#079C31" stroke-width="5"/>
					<line x1="461.863" y1="860.695" x2="108.309" y2="507.141" stroke="#079C31" stroke-width="5"/>
					<line x1="497.218" y1="825.34" x2="143.665" y2="471.786" stroke="#079C31" stroke-width="5"/>
					<line x1="532.573" y1="789.984" x2="179.02" y2="436.431" stroke="#079C31" stroke-width="5"/>
					<line x1="567.929" y1="754.629" x2="214.375" y2="401.075" stroke="#079C31" stroke-width="5"/>
					<line x1="603.284" y1="719.273" x2="249.731" y2="365.72" stroke="#079C31" stroke-width="5"/>
					<line x1="638.639" y1="683.918" x2="285.086" y2="330.365" stroke="#079C31" stroke-width="5"/>
					<line x1="673.995" y1="648.563" x2="320.441" y2="295.009" stroke="#079C31" stroke-width="5"/>
					<line x1="709.35" y1="613.207" x2="355.797" y2="259.654" stroke="#079C31" stroke-width="5"/>
					<line x1="744.705" y1="577.852" x2="391.152" y2="224.299" stroke="#079C31" stroke-width="5"/>
					<line x1="179.02" y1="645.027" x2="532.573" y2="291.474" stroke="#079C31" stroke-width="5"/>
					<line x1="214.375" y1="680.383" x2="567.929" y2="326.829" stroke="#079C31" stroke-width="5"/>
					<line x1="249.731" y1="715.738" x2="603.284" y2="362.184" stroke="#079C31" stroke-width="5"/>
					<line x1="285.086" y1="751.093" x2="638.639" y2="397.54" stroke="#079C31" stroke-width="5"/>
					<line x1="320.441" y1="786.449" x2="673.995" y2="432.895" stroke="#079C31" stroke-width="5"/>
					<line x1="355.797" y1="821.804" x2="709.35" y2="468.251" stroke="#079C31" stroke-width="5"/>
					<line x1="391.152" y1="857.159" x2="744.705" y2="503.606" stroke="#079C31" stroke-width="5"/>
					<line x1="143.665" y1="609.672" x2="497.218" y2="256.119" stroke="#079C31" stroke-width="5"/>
				</svg>
				<p tw="ml-3 text-2xl font-semibold  text-[#c4fcfc]">${siteConfig.title}</p>
			</div>
			<p>✒️ ${siteConfig.author}</p>
		</div>
	</div>`;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function GET(context: APIContext) {
	const { title, pubDate } = context.props as Props;

	const postDate = getFormattedDate(pubDate, {
		weekday: "long",
		month: "long",
	});
	const svg = await satori(markup(title, postDate), ogOptions);
	const png = new Resvg(svg).render().asPng();
	return new Response(png, {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=31536000, immutable",
		},
	});
}

export async function getStaticPaths() {
	const posts = await getAllPosts();
	return posts
		.filter(({ data }) => !data.ogImage)
		.map((post) => ({
			params: { slug: post.slug },
			props: {
				title: post.data.title,
				pubDate: post.data.updatedDate ?? post.data.publishDate,
			},
		}));
}
