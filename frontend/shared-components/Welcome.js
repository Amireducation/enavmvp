import React from "react";
import { useTranslation } from "react-i18next";

export default function Welcome() {
  const { t } = useTranslation();
  return <h2>{t("welcome")}</h2>;
}
