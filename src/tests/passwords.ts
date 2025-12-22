interface testingPasswords {
    hash: string,
    password: string,
    frontPrefix: string | null,
    endPrefix: string | null
}

export const customTestPasswords: testingPasswords[] = [
    { password: "penis", frontPrefix: null, endPrefix: null, hash: "f6952d6eef555ddd87aca66e56b91530222d6e318414816f3ba7cf5bf694bf0f", },
    { password: "sex", frontPrefix: null, endPrefix: null, hash: "98d44e13f455d916674d38424d39e1cb01b2a9132aacbb7b97a6f8bb7feb2544", },
    { password: "pain", frontPrefix: null, endPrefix: null, hash: "5c78c8e7160e76ba9b6c41f74247bb7ba4887f5c06faecd6b9a009785b248c72", },
    { password: "gay", frontPrefix: null, endPrefix: null, hash: "586acb3c6bac489308c0938f762da702573a714dfdf3a729dcb40758b4c363ae", },
    { password: "gorillaz", frontPrefix: "gor", endPrefix: null, hash: "d1de50137a3a6a6f59048dc234db2e9006b03ae52e5c5a844ae3ef769ee50988", },
    { password: "linkinpark", frontPrefix: null, endPrefix: "park", hash: "f46daca7eb795765f476243ee233a9c3fa03bd49e71121bb5aebad24a0b5d015", },
    { password: "steve sex jobs", frontPrefix: "steve ", endPrefix: " jobs", hash: "46a792af41ba4e0edfecdb6823dfdb901945a1297f6699895ea00c8fd20ff3dc", },
    { password: "tatsuki", frontPrefix: "tat", endPrefix: null, hash: "8e1622631316fb574346ee0cb4023a8a06c9df163bc55e782e3c936ae0b199f2", },
    { password: "fujimoto", frontPrefix: null, endPrefix: "moto", hash: "f8ee130c7204c6e73f6d4c972c7d94553c5f6babf0eea032b411fa30f7acf739", },
];
