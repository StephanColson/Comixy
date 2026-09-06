import { useState, useMemo } from "react";

export function useEditionFiltering(props) {
  const { editions, organizations, peoples, roles } = props;

  const [searchQuery, setSearchQuery] = useState({
    format: "",
    printType: "",
    language: "",
    publisher: "",
  });

  const dataFormat = useMemo(() => {
    const formats = editions.map((e) => e.format);
    const unique = [...new Set(formats)];
    return unique.map((f) => ({ id: f, label: f }));
  }, [editions]);

  const dataPrintType = useMemo(() => {
    const types = editions.map((e) => e.printType);
    const unique = [...new Set(types)];
    return unique.map((pt) => ({ id: pt, label: pt }));
  }, [editions]);

  const dataLanguage = useMemo(() => {
    const languages = editions.map((e) => e.language);
    const unique = [...new Set(languages)].filter(Boolean);
    return unique.map((l) => ({ id: l, label: l }));
  }, [editions]);

  function filterList(list, search, selector) {
    if (!search) return list;
    const lower = search.toLowerCase();
    return list.filter((item) => selector(item).toLowerCase().includes(lower));
  }

  const filteredFormat = filterList(
    dataFormat,
    searchQuery.format,
    (f) => f.label,
  );

  const filteredPrintType = filterList(
    dataPrintType,
    searchQuery.printType,
    (pt) => pt.label,
  );

  const filteredLanguage = filterList(
    dataLanguage,
    searchQuery.language,
    (l) => l.label,
  );

  const filteredPublishers = filterList(
    organizations,
    searchQuery.publisher,
    (p) => p.name,
  );

  return {
    searchQuery,
    setSearchQuery,
    filteredFormat,
    filteredPrintType,
    filteredLanguage,
    filteredPublishers,
  };
}
