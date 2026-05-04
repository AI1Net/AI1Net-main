--
-- PostgreSQL database dump
--

\restrict T3pjnpuhXGmhjGKKXFbQ89MZ8qFmz6826Buiqp4NhQRRgesWhs2CLoJVjT83QQd

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ai_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.ai_category AS ENUM (
    'TEXT',
    'IMAGE',
    'VIDEO',
    'CODE',
    'VOICE',
    'MULTIMODAL'
);


ALTER TYPE public.ai_category OWNER TO postgres;

--
-- Name: proposal_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.proposal_status AS ENUM (
    'ACTIVE',
    'PASSED',
    'REJECTED'
);


ALTER TYPE public.proposal_status OWNER TO postgres;

--
-- Name: reward_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reward_type AS ENUM (
    'USAGE',
    'REFERRAL',
    'CONTRIBUTION',
    'BONUS'
);


ALTER TYPE public.reward_type OWNER TO postgres;

--
-- Name: stake_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.stake_status AS ENUM (
    'ACTIVE',
    'COMPLETED',
    'WITHDRAWN'
);


ALTER TYPE public.stake_status OWNER TO postgres;

--
-- Name: transaction_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_type AS ENUM (
    'SPEND',
    'EARN',
    'STAKE',
    'UNSTAKE',
    'REWARD'
);


ALTER TYPE public.transaction_type OWNER TO postgres;

--
-- Name: usage_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.usage_status AS ENUM (
    'SUCCESS',
    'FAILED',
    'PENDING'
);


ALTER TYPE public.usage_status OWNER TO postgres;

--
-- Name: vote_choice; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.vote_choice AS ENUM (
    'YES',
    'NO',
    'ABSTAIN'
);


ALTER TYPE public.vote_choice OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id text NOT NULL,
    user_id text,
    action text NOT NULL,
    metadata text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: ai_providers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_providers (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    website text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ai_providers OWNER TO postgres;

--
-- Name: ai_tools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_tools (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    category public.ai_category NOT NULL,
    provider_id text NOT NULL,
    price_per_use real DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ai_tools OWNER TO postgres;

--
-- Name: ai_usage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_usage (
    id text NOT NULL,
    user_id text NOT NULL,
    tool_id text NOT NULL,
    input text NOT NULL,
    output text,
    tokens_used real NOT NULL,
    status public.usage_status DEFAULT 'PENDING'::public.usage_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ai_usage OWNER TO postgres;

--
-- Name: proposals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proposals (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    status public.proposal_status DEFAULT 'ACTIVE'::public.proposal_status NOT NULL,
    end_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.proposals OWNER TO postgres;

--
-- Name: rewards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rewards (
    id text NOT NULL,
    user_id text NOT NULL,
    type public.reward_type NOT NULL,
    amount real NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rewards OWNER TO postgres;

--
-- Name: stakes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stakes (
    id text NOT NULL,
    user_id text NOT NULL,
    amount real NOT NULL,
    status public.stake_status DEFAULT 'ACTIVE'::public.stake_status NOT NULL,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone
);


ALTER TABLE public.stakes OWNER TO postgres;

--
-- Name: token_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.token_transactions (
    id text NOT NULL,
    user_id text NOT NULL,
    type public.transaction_type NOT NULL,
    amount real NOT NULL,
    metadata text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.token_transactions OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    clerk_id text NOT NULL,
    email text NOT NULL,
    name text,
    avatar text,
    token_balance real DEFAULT 500 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: votes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.votes (
    id text NOT NULL,
    user_id text NOT NULL,
    proposal_id text NOT NULL,
    choice public.vote_choice NOT NULL,
    weight real DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.votes OWNER TO postgres;

--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, user_id, action, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: ai_providers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_providers (id, name, description, website, created_at) FROM stdin;
prov-openai	OpenAI	Creator of GPT and DALL-E series models	https://openai.com	2026-05-02 04:30:44.633295+00
prov-anthropic	Anthropic	AI safety company behind Claude models	https://anthropic.com	2026-05-02 04:30:44.633295+00
prov-stability	Stability AI	Open-source image and video generation	https://stability.ai	2026-05-02 04:30:44.633295+00
prov-google	Google DeepMind	Gemini and other frontier AI models	https://deepmind.google	2026-05-02 04:30:44.633295+00
prov-runway	Runway ML	Professional AI video generation tools	https://runwayml.com	2026-05-02 04:30:44.633295+00
\.


--
-- Data for Name: ai_tools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_tools (id, name, slug, description, category, provider_id, price_per_use, created_at) FROM stdin;
tool-gpt4o	GPT-4o	gpt-4o	OpenAI's most capable multimodal model for text, vision, and reasoning tasks	TEXT	prov-openai	2	2026-05-02 04:30:44.633295+00
tool-o1	o1 Reasoning	o1-reasoning	Advanced chain-of-thought reasoning model for complex problems	TEXT	prov-openai	5	2026-05-02 04:30:44.633295+00
tool-claude35	Claude 3.5 Sonnet	claude-35-sonnet	Anthropic's most intelligent model with exceptional coding capabilities	CODE	prov-anthropic	3	2026-05-02 04:30:44.633295+00
tool-claude-opus	Claude 3 Opus	claude-3-opus	Maximum intelligence for highly complex tasks and research	TEXT	prov-anthropic	4	2026-05-02 04:30:44.633295+00
tool-dalle3	DALL-E 3	dalle-3	High-quality text-to-image generation with precise prompt adherence	IMAGE	prov-openai	4	2026-05-02 04:30:44.633295+00
tool-sdxl	Stable Diffusion XL	stable-diffusion-xl	Open-source photorealistic image generation	IMAGE	prov-stability	2	2026-05-02 04:30:44.633295+00
tool-gemini-pro	Gemini 1.5 Pro	gemini-15-pro	Google's multimodal model with 1M token context window	MULTIMODAL	prov-google	3	2026-05-02 04:30:44.633295+00
tool-codex	Codex Pro	codex-pro	Specialized code generation, review, and debugging assistant	CODE	prov-openai	2	2026-05-02 04:30:44.633295+00
tool-gen3	Gen-3 Alpha	gen-3-alpha	Runway's latest high-fidelity video generation model	VIDEO	prov-runway	8	2026-05-02 04:30:44.633295+00
tool-whisper	Whisper v3	whisper-v3	Industry-leading speech-to-text transcription with multilingual support	VOICE	prov-openai	1	2026-05-02 04:30:44.633295+00
tool-tts	Text-to-Speech HD	tts-hd	Natural voice synthesis with 10+ voice options and emotional control	VOICE	prov-openai	2	2026-05-02 04:30:44.633295+00
tool-svd	Stable Video	stable-video	Transform images into smooth, high-quality video clips	VIDEO	prov-stability	6	2026-05-02 04:30:44.633295+00
\.


--
-- Data for Name: ai_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_usage (id, user_id, tool_id, input, output, tokens_used, status, created_at) FROM stdin;
4cec0f3b-7d58-43f1-ae87-7af3d904028d	b86c6fbf-1692-450b-987f-8e51dfec78ae	tool-claude35	KLIUU	```typescript\nfunction optimizeQuery(data: any[]) {\n  return data\n    .filter(item => item.active)\n    .sort((a, b) => b.score - a.score)\n    .slice(0, 10);\n}\n```	3	SUCCESS	2026-05-02 05:01:49.05943+00
8d73fe31-e2b0-448c-8679-7c4fd5142c5f	b86c6fbf-1692-450b-987f-8e51dfec78ae	tool-claude35	HELLO\n	```typescript\nfunction optimizeQuery(data: any[]) {\n  return data\n    .filter(item => item.active)\n    .sort((a, b) => b.score - a.score)\n    .slice(0, 10);\n}\n```	3	SUCCESS	2026-05-02 05:01:55.908673+00
\.


--
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proposals (id, title, description, status, end_date, created_at) FROM stdin;
prop-001	AI1NET Fee Reduction Protocol v2	Proposal to reduce transaction fees by 15% across all AI tool categories to incentivize higher network utilization and onboard new users to the ecosystem.	ACTIVE	2026-05-16 04:30:44.633295+00	2026-04-30 04:30:44.633295+00
prop-002	Community AI Model Integration Fund	Allocate 50,000 $AI1NET from the treasury to fund integration of 5 new open-source AI models into the platform, chosen by community vote.	ACTIVE	2026-05-09 04:30:44.633295+00	2026-05-01 04:30:44.633295+00
prop-003	Staking Rewards Enhancement	Increase staking APY from 8% to 12% for tokens locked for 90+ days to encourage long-term network participation.	PASSED	2026-05-01 04:30:44.633295+00	2026-04-22 04:30:44.633295+00
prop-004	Governance Participation Threshold	Lower minimum token stake required for governance voting from 100 to 10 $AI1NET to increase participation.	REJECTED	2026-04-27 04:30:44.633295+00	2026-04-12 04:30:44.633295+00
\.


--
-- Data for Name: rewards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rewards (id, user_id, type, amount, created_at) FROM stdin;
9ce6be9e-61aa-4714-85c2-118a01debd9f	b86c6fbf-1692-450b-987f-8e51dfec78ae	USAGE	0.3	2026-05-02 05:01:49.07303+00
d208a9e8-1985-4d6d-8eb7-78950b0357f3	b86c6fbf-1692-450b-987f-8e51dfec78ae	USAGE	0.3	2026-05-02 05:01:55.921837+00
\.


--
-- Data for Name: stakes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stakes (id, user_id, amount, status, start_date, end_date) FROM stdin;
\.


--
-- Data for Name: token_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.token_transactions (id, user_id, type, amount, metadata, created_at) FROM stdin;
aa73c070-1f08-4f8f-a648-ad9dd7beb34e	b86c6fbf-1692-450b-987f-8e51dfec78ae	SPEND	3	AI request to Claude 3.5 Sonnet	2026-05-02 05:01:49.069547+00
c3b375b3-eed3-4414-b8c7-222e8861b359	b86c6fbf-1692-450b-987f-8e51dfec78ae	REWARD	0.3	Usage reward for Claude 3.5 Sonnet	2026-05-02 05:01:49.079699+00
7b344aef-e6cf-4eec-9559-084d445889a4	b86c6fbf-1692-450b-987f-8e51dfec78ae	SPEND	3	AI request to Claude 3.5 Sonnet	2026-05-02 05:01:55.915905+00
5491b338-73b0-4e7b-aff3-13b2fd5a94ad	b86c6fbf-1692-450b-987f-8e51dfec78ae	REWARD	0.3	Usage reward for Claude 3.5 Sonnet	2026-05-02 05:01:55.929925+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, clerk_id, email, name, avatar, token_balance, created_at, updated_at) FROM stdin;
b86c6fbf-1692-450b-987f-8e51dfec78ae	user_3D9dBl1JkrMct67pT4SXgd5zEJN	user_3D9dBl1JkrMct67pT4SXgd5zEJN@ai1net.app	\N	\N	494.6	2026-05-02 05:01:30.323391+00	2026-05-02 05:01:55.924+00
\.


--
-- Data for Name: votes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.votes (id, user_id, proposal_id, choice, weight, created_at) FROM stdin;
\.


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: ai_providers ai_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_providers
    ADD CONSTRAINT ai_providers_pkey PRIMARY KEY (id);


--
-- Name: ai_tools ai_tools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_tools
    ADD CONSTRAINT ai_tools_pkey PRIMARY KEY (id);


--
-- Name: ai_tools ai_tools_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_tools
    ADD CONSTRAINT ai_tools_slug_unique UNIQUE (slug);


--
-- Name: ai_usage ai_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_pkey PRIMARY KEY (id);


--
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (id);


--
-- Name: rewards rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_pkey PRIMARY KEY (id);


--
-- Name: stakes stakes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stakes
    ADD CONSTRAINT stakes_pkey PRIMARY KEY (id);


--
-- Name: token_transactions token_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_transactions
    ADD CONSTRAINT token_transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_clerk_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_clerk_id_unique UNIQUE (clerk_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- Name: votes votes_user_id_proposal_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_proposal_id_unique UNIQUE (user_id, proposal_id);


--
-- Name: ai_tools ai_tools_provider_id_ai_providers_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_tools
    ADD CONSTRAINT ai_tools_provider_id_ai_providers_id_fk FOREIGN KEY (provider_id) REFERENCES public.ai_providers(id);


--
-- Name: ai_usage ai_usage_tool_id_ai_tools_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_tool_id_ai_tools_id_fk FOREIGN KEY (tool_id) REFERENCES public.ai_tools(id);


--
-- Name: ai_usage ai_usage_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_usage
    ADD CONSTRAINT ai_usage_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: rewards rewards_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: stakes stakes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stakes
    ADD CONSTRAINT stakes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: token_transactions token_transactions_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.token_transactions
    ADD CONSTRAINT token_transactions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: votes votes_proposal_id_proposals_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_proposal_id_proposals_id_fk FOREIGN KEY (proposal_id) REFERENCES public.proposals(id);


--
-- Name: votes votes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict T3pjnpuhXGmhjGKKXFbQ89MZ8qFmz6826Buiqp4NhQRRgesWhs2CLoJVjT83QQd

