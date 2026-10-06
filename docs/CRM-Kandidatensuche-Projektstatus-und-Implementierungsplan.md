# CRM Kandidatensuche Projektstatus und Implementierungsplan
> **Name note, 5 October 2026:** The user rejected the working title Lena. These pages keep the dated findings. Current names and the transition decision are in [project.md](project.md) and [memory.md](memory.md). The Linear title has not been renamed because no replacement name was given.

> **Nachfolge, 6. Oktober 2026:** Der neue Server behält das Geburtsdatum in der Suchliste und den Filter `eu_buerger`. Siehe [changes.md](changes.md).

> **Historischer Plan — ersetzt am 5. Oktober 2026.** Der aktive Projektkontext
> ist ersetzt. Aktuelle Quellen sind project.md, memory.md und
> [project.md](project.md), [open-work.md](open-work.md) und
> [../server/SPEC.md](../server/SPEC.md). Der Worker-Bundle wurde inzwischen
> nach `worker-source/` geladen; seine reproduzierbare Source-Provenienz bleibt
> offen. Die DOCX-Fassung dieses Dokuments enthält diese Korrektur nicht.

Datum: 25. septembar 2026.

## Dodatak: lokalno usklađivanje 2. oktobra 2026.

Plugin je usklađen na verziju `0.1.0-beta.2` prema ovom planu i pripremljenom MCP vodiču iz Desktop paketa. Dodane su precizne reference za upite i privatnost, MCP guide u Markdown/JSON formatu pod `candidate-search/mcp/`, strukturirani sintetički evaluacijski scenariji i lokalni provjerivač konzistentnosti `scripts/validate_package.py`. Izvorni datum i naredni plan opisuju ranije stanje; DOCX verzija ne uključuje ovaj dodatak.

Povezani `crm_search_guide` pročitan je 2. oktobra 2026. i još navodi državljanstvo; izložena shema `crm_search_kandidaten` još ima `eu_buerger`. Lokalna politika zabranjuje njihovu upotrebu. To je dokumentovan nesklad, ne dokaz da je baza ili server usklađen. Worker kod još nije dostupan u ovom repozitoriju, novi guide nije deployan, a sigurnost handlera i ponašanje evaluacijskih slučajeva nisu potvrđeni.

Za nastavak serverskog rada potreban je Worker repozitorij ili putanja njegovog izvornog koda. TypeSafe, OAuth, pregled fotografija i biometrija ostaju planirane funkcije. Autor u manifestima već je `Adel Hrnjić`; ranija stavka o placeholderu `Local developer` više nije primjenjiva.

Lokalna verifikacija: `scripts/validate_package.py` prolazi; službeni `quick_validate.py` javlja `Skill is valid!`; YAML metapodaci i automatska aktivacija su provjereni. Službeni plugin-creator validator nije instaliran na ovom računaru pa puna provjera plugin sheme nije izvršena. MCP Inspector, autorizacijski testovi i 39 novih behavioral/server scenarija nisu izvršeni; njihovi očekivani ishodi nisu testni rezultati.

## Svrha dokumenta

Ovaj dokument predstavlja osnovu za odobrenje izrade plugina. Razdvaja ono što postoji u datotekama, ono što je dogovoreno kao projektna politika i ono što tek treba implementirati ili testirati. Trenutni paket je dobra osnova za read-only CRM pretragu, ali još nije završena produkcijska aplikacija: izvorni kod Cloudflare Workera nije u repozitoriju, TypeSafe integracija nije ugrađena, OAuth povezivanje nije implementirano, a obrada fotografija pripada drugoj fazi.

## Status na jednom mjestu

| Područje | Status | Dokaz ili ograničenje |
| --- | --- | --- |
| Struktura plugina | Postoji | `candidate-search/` s prenosivim i Codex manifestima |
| CRM skill | Postoji | `skills/crm-kandidatensuche/` i globalno dostupan skill |
| MCP veza | Deklarisana | Referenciran je udaljeni Streamable HTTP `/mcp` endpoint |
| MCP Worker kod | Nije dostupan | U repozitoriju nema `server/` niti Worker izvornog koda |
| Sigurnosna pravila | Dokumentovana | Privacy i tool-contract reference postoje |
| Behavioral eval skup | Postoji | Aktivacijski i sigurnosni slučajevi u `tests/evals.json` |
| TypeSafe adapter | Planiran | Nema koda, zavisnosti, policy modula ni MCP alata |
| TypeSafe OAuth | Nije potvrđen | TypeSafe javno dokumentuje API ključ, ne third-party OAuth povezivanje |
| Fotografije i vision | Faza 2 | Jev trenutno prima samo tekst i strukturirani JSON |
| Git stanje | Nespremno za izdanje | Repozitorij nema commit historiju; datoteke su necommitovane |
| Produkcijska verifikacija | Nije završena | Potrebni su validatori, MCP Inspector, autorizacijski i regresijski testovi |

## Postojeća struktura projekta

```text
MCP Plugin/
├── AGENTS.md
├── README.md
├── candidate-search/
│   ├── plugin.json
│   ├── mcp.json
│   ├── .mcp.json
│   ├── .codex-plugin/plugin.json
│   ├── skills/crm-kandidatensuche/
│   │   ├── SKILL.md
│   │   ├── agents/openai.yaml
│   │   └── references/
│   │       ├── privacy.md
│   │       └── tool-contracts.md
│   └── tests/evals.json
└── docs/
```

Na Desktopu postoji i paket `CRM-Kandidatensuche-Paket` sa izvornim skillom, instalacijskim ZIP-om i Markdown/JSON izvozom za `crm_search_guide`. ZIP sadrži samo skill, README i `agents/openai.yaml`; ne sadrži token ni Worker kod.

## Završeno i potvrđeno u datotekama

- Napravljen je `AGENTS.md` sa strukturom projekta, komandama, stilom, testiranjem, commit pravilima i sigurnosnim smjernicama.
- Napravljeni su prenosivi `plugin.json` i Codex kompatibilni `.codex-plugin/plugin.json`.
- MCP zavisnost `pipedrive-crm` deklarisana je kao udaljeni Streamable HTTP server.
- CRM skill je ograničen na read-only pretragu kandidata, zanimanja, jezika, firmi i naloga.
- Definisana su pravila za minimalni opseg upita, arhivirane kandidate, brojanje jedinstvenih kandidata, jezičke vrijednosti i kontrolisani `SELECT` fallback.
- Definisani su očekivani sigurnosni ugovori servera: autorizacija, tenant scope, parametrizovani SQL, allowliste, ograničenja rezultata i sigurne greške.
- Dodan je početni evaluacijski skup za aktivaciju, odbijanje write zahtjeva, NULL semantiku, arhivu, pagination limite i zaštitu osjetljivih polja.
- Potvrđeno je da repozitorij ne sadrži API ključ niti bearer token.

## Dokumentovane odluke koje još nisu implementirane

### Hijerarhija odluka

1. Autorizacija, privatnost i serverska sigurnosna pravila.
2. Precizni SQL rezultati i deterministička poslovna pravila.
3. Izričita odluka ovlaštenog korisnika.
4. TypeSafe za uske semantičke procjene.
5. ChatGPT za orkestraciju, objašnjenje i prikaz.

TypeSafe ne može nadjačati dozvole, tačne CRM činjenice ili zabranjena polja. Kod neslaganja ChatGPT-a i TypeSafea odluka se šalje korisniku; TypeSafe nije univerzalni konačni odlučilac.

### TypeSafe pragovi

Ocjena podudaranja i pouzdanost vode se odvojeno. Predloženi početni pragovi su:

- ispod `0.70`: rezultat je neodređen i traži pojašnjenje;
- `0.70` do `0.849`: prijedlog zahtijeva ljudsku potvrdu;
- od `0.85`: rezultat se može koristiti za niskorizično rangiranje;
- od `0.90`: jaka indikacija za osjetljive zastavice, ali bez automatskog spajanja ili odbijanja kandidata.

Pragovi se moraju kalibrirati na označenim CRM primjerima. Jedan prag se ne primjenjuje na sve vrste pitanja.

### Atomsko ocjenjivanje kandidata

Svaka dimenzija dobija zasebno TypeSafe pitanje. Ukupni score računa aplikacijski kod tek nakon provjere pojedinačnih odgovora.

| Dimenzija | Početna težina | Opis |
| --- | ---: | --- |
| Funkcionalno podudaranje pozicije | 30 posto | Ista ili prenosiva vrsta posla |
| Relevantne stručne vještine | 25 posto | Semantičko podudaranje traženih vještina |
| Relevantnost iskustva | 20 posto | Veza prethodnih zadataka sa zahtjevom |
| Industrijsko iskustvo | 10 posto | Iskustvo u odgovarajućoj domeni |
| Nivo odgovornosti | 10 posto | Samostalnost, vođenje i obim odgovornosti |
| Kvalitet dokaza | 5 posto | Dostupnost podataka koji podržavaju procjenu |

Lokacija, strukturirani nivo jezika, certifikati, status i precizne godine iskustva ostaju deterministički filteri. Nepoznata vrijednost nije negativna ocjena; označava se kao nedovoljno podataka.

## Politika podataka kandidata

### Obavezna validacija

- Datum rođenja čuva se kao `YYYY-MM-DD`; mora biti stvaran, potpun i ne smije biti u budućnosti.
- Dob se izračunava iz datuma rođenja i datuma procjene. Ne čuva se kao nezavisna trajna vrijednost.
- Mjesto i država čuvaju se kao doslovni izvorni tekst te strukturirani `city`, `country_name` i ISO `country_code`.
- Država označava mjesto boravka ili rada, ne državljanstvo.

Dob i datum rođenja služe validaciji i izričitim ovlaštenim filterima; ne ulaze u semantički match-score.

### Zabranjeni podaci

Sljedeća polja ne smiju postojati u novoj shemi, TypeSafe stanju, promptovima, logovima ili audit zapisima:

- spol ili pol;
- vjera;
- zdravstveni podaci;
- etničko porijeklo;
- nacionalnost ili državljanstvo.

Ako se pronađu u uvezenom tekstu, moraju biti uklonjeni prije vanjske obrade.

### Opcionalni podaci

Bračno stanje i informacije o porodici nisu obavezni, ne utiču na rangiranje i ne šalju se TypeSafeu. Preporuka je da ih sistem ne traži; postojeći podatak može ostati samo uz potvrđenu zakonitost, svrhu i ograničen pristup.

### Slobodne bilješke

Bilješka mora biti profesionalna, činjenična, poslovno relevantna, neutralna i povezana s autorom i datumom. Potrebne su odvojene provjere za relevantnost, profesionalni ton, uvrede, zabranjene podatke, nepotrebne privatne informacije i nepotkrijepljene tvrdnje.

Zabranjeni podatak blokira čuvanje. Vjerovatnoća štetnog sadržaja od `0.70` blokira bilješku; raspon `0.30` do `0.699` zahtijeva pregled. Relevantnost i profesionalni ton trebaju doseći najmanje `0.85`. Sistem može predložiti neutralnu preradu, ali korisnik mora potvrditi novu verziju.

## Fotografije i duplikati

Fotografija ima dvije odvojene svrhe. Nijedna ne utiče na stručnu ocjenu kandidata.

### Provjera upotrebljivosti fotografije

Planirani vision modul treba vratiti samo strukturirane oznake kao što su broj osoba, vidljivost lica, vrsta slike, tehnički kvalitet i kontekstualne zastavice. Dozvoljene zastavice uključuju mutnu sliku, nisku rezoluciju, grupnu fotografiju, screenshot, ležeći ili krevetni kontekst, vidljiv alkohol, pušenje, eksplicitan sadržaj ili oružje.

Sistem ne smije opisivati izgled osobe niti procjenjivati dob, spol, etničko porijeklo, vjeru, privlačnost, emocije ili karakter. Rezultat je `usable`, `review`, `unusable` ili `unknown` i određuje samo prikaz ili ljudski pregled fotografije.

### Provjera duplikata

Prva faza koristi normalizovano ime, kontaktne identifikatore, lokaciju, historiju poslodavaca, vremensku liniju, SHA-256 datoteke i perceptual hash fotografije. Perceptual hash može pronaći istu ili izmijenjenu datoteku, ali ne potvrđuje identitet osobe.

Biometrijsko poređenje lica odgađa se za fazu 2. Prije njegove izrade potrebni su pravna osnova, DPIA, procjena nužnosti i proporcionalnosti, pravila zadržavanja, testovi pristrasnosti i obavezna ljudska potvrda. Sistem nikada ne smije automatski spojiti dva kandidata.

### Podaci za fazu 2 i fine tuning

Skup za buduće testiranje treba sadržati pseudonimizovani image ID, dokaz o dopuštenom porijeklu, svrhu, verziju politike, odvojene tehničke i kontekstualne oznake, konačnu oznaku, razlog odluke, najmanje dva anotatora, slaganje anotatora, verziju modela i pripadnost train, validation ili test skupu. Sve slike iste osobe moraju ostati u samo jednom skupu.

## Planirana tehnička arhitektura

### Osnovni runtime

`ChatGPT ili Codex -> Candidate Search plugin -> CRM MCP -> Cloudflare Worker -> CRM baza`

Osnovna CRM funkcionalnost mora raditi bez TypeSafe ključa.

### Opcionalni TypeSafe sloj

Cloudflare Worker dobija mali serverski adapter koji poziva TypeSafe samo za odobrene semantičke zadatke. Predloženi MCP alati su:

- `evaluate_candidate_match`;
- `check_possible_duplicate`;
- `classify_candidate_profession`;
- `evaluate_search_query_intent`;
- `review_candidate_note`;
- `get_capabilities`.

`get_capabilities` smije vratiti samo status kao `typesafe.enabled` i `typesafe.status`; nikada ne vraća ključ ili njegov dio. Pitanja, pragovi, težine, fallback i verzije politike drže se u jednom serverskom policy modulu.

### Autentifikacija i tajne

TypeSafe trenutno javno dokumentuje API ključ, ne third-party OAuth tok. Za beta test koristi se novi rotirani ključ koji se unosi direktno kao Cloudflare secret. Ključ se ne stavlja u chat, repozitorij, skill, MCP argument, log ili URL.

Za finalnu verziju plugin koristi vlastiti OAuth 2.1 account-linking prema Cloudflare backendu. Korisnik kroz sigurni portal povezuje račun i po potrebi pohranjuje TypeSafe ključ u šifriranom server-side spremištu. ChatGPT vidi samo OAuth token za naš MCP server.

Prethodno objavljeni testni TypeSafe ključ opozvan je i tokeni su resetovani 25. septembra 2026. Ne smije se ponovo koristiti.

## Kontrolna lista za implementaciju

### Prije početka razvoja

- [ ] Vlasnik pregleda i odobri ovaj dokument.
- [x] Izloženi TypeSafe ključ je opozvan i tokeni su resetovani; novi testni ključ treba generisati i unijeti izvan chata.
- [ ] Osigurati pristup izvornom kodu Cloudflare Workera.
- [ ] Potvrditi vlasnika, tenant model i uloge korisnika.
- [ ] Potvrditi beta opseg i koje TypeSafe procjene ulaze u prvu verziju.
- [ ] Odrediti pravnu osnovu i retention politiku za podatke kandidata.
- [ ] Odlučiti da li se opcionalni bračni i porodični podaci uopće zadržavaju.

### Beta implementacija

- [ ] Dodati serversku autentifikaciju i autorizaciju u svaki MCP handler.
- [ ] Uvesti read-only DB principal, parametrizovane upite, allowliste, timeout i row cap.
- [ ] Implementirati `get_capabilities` i fallback bez TypeSafea.
- [ ] Implementirati centralni TypeSafe policy modul.
- [ ] Početi s najviše dvije semantičke funkcije: match-score i kontrola bilješki.
- [ ] Dodati strukturirane output sheme i sigurne greške.
- [ ] Dodati audit bez tajni i nepotrebnih ličnih podataka.
- [ ] Postaviti novi TypeSafe ključ kao Cloudflare secret.
- [ ] Ažurirati skill i reference samo za stvarno implementirane alate.

### Faza 2

- [ ] Implementirati photo suitability kroz odabrani vision servis.
- [ ] Dokumentovati i označiti reprezentativni skup fotografija.
- [ ] Izvršiti DPIA prije bilo kakvog biometrijskog poređenja.
- [ ] Testirati pristrasnost, false positive i false negative stope.
- [ ] Uvesti portal za upravljanje povezivanjem, tajnama i opozivom pristupa.
- [ ] Razmotriti fine tuning tek nakon beta mjerenja i odobrenja skupa podataka.

## Plan testiranja

### Struktura i pakovanje

- Pokrenuti plugin i skill validatore navedene u `README.md` i `AGENTS.md`.
- Provjeriti obje manifest varijante i uskladiti njihove metapodatke.
- Zamijeniti placeholder `Local developer` odobrenim imenom prije izdanja.
- Potvrditi da ZIP i release paket ne sadrže tajne, CRM izvoze ni stvarne podatke.

### MCP i baza

- MCP Inspector: initialization, tools/list, input i output sheme, anotacije i greške.
- Autorizacija: bez tokena, pogrešan tenant, nedovoljan scope, istekao token i opozvan pristup.
- SQL sigurnost: injection payload, nepoznata polja, zabranjene tabele i write naredbe.
- Rezultati: arhiva, distinct brojanje, jezički NULL slučajevi, pagination i timeout.
- Privatnost: minimalni rezultat, kontaktni podaci, bulk export i sigurne greške.

### TypeSafe

- Rad bez ključa i bez prekida osnovnog CRM toka.
- Nevažeći ključ, timeout, `429`, `529` i parcijalni neuspjeh.
- Atomska pitanja i nezavisna obrada odgovora.
- Pragovi `0.70`, `0.85` i `0.90` na označenim primjerima.
- Neslaganje ChatGPT-a i TypeSafea uvijek ide korisniku.
- Mjerenje kvaliteta, cijene i latencije po vrsti procjene.

### Podaci i bilješke

- ISO validacija datuma, budući i nemogući datumi te usklađenost izračunate dobi.
- Doslovni tekst mjesta i države uz strukturirani country code.
- Potpuno odbijanje zabranjenih polja iz sheme i vanjske obrade.
- Uvrede, nepotrebni privatni sadržaj, nepodržane tvrdnje i neutralno prepisivanje bilješke.

### Fotografije i duplikati

- Exact hash, perceptual hash, izmijenjena rezolucija i kompresija.
- Grupna, mutna, tamna, dokument, screenshot i neprikladan kontekst.
- Nema opisa fizičkog izgleda niti izvedenih osjetljivih osobina.
- Nema automatskog spajanja kandidata.
- Sve granične i nesigurne procjene ulaze u ljudski pregled.

## Kriteriji za odobrenje izrade

Izrada može početi kada su odobreni beta opseg, politika podataka, TypeSafe dimenzije i pragovi, te kada je dostupan Worker kod. Beta se može smatrati spremnom za ograničeno testiranje tek nakon prolaska strukturnih validatora, MCP Inspector provjere, autorizacijskih testova, sigurnosnih negativnih testova i označenog TypeSafe eval skupa.

Fotografije, biometrijsko poređenje i fine tuning nisu uslov za prvu beta verziju. Oni ostaju zasebna faza sa svojim pravnim, podatkovnim i kvalitetnim odobrenjem.

## Referentni izvori

- Projektni repozitorij `MCP Plugin` i paket `CRM-Kandidatensuche-Paket` pregledani 25. septembra 2026.
- OpenAI Plugin Authentication: https://developers.openai.com/plugins/build/auth
- OpenAI Plugin Security and Privacy: https://developers.openai.com/plugins/guides/security-privacy
- TypeSafe documentation index: https://docs.typesafe.ai/llms.txt
- TypeSafe API reference: https://docs.typesafe.ai/api
- TypeSafe confidence: https://docs.typesafe.ai/confidence
- TypeSafe state and input support: https://docs.typesafe.ai/concepts/state
- TypeSafe composite scoring: https://docs.typesafe.ai/patterns/composite-scoring
- EDPB Guidelines on video devices and biometric processing: https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201903_video_devices.pdf
