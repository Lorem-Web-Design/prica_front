import { PropsWithChildren, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type DropdownAction = {
    isActive: boolean
}
export default function DropDown({ children, isActive }: PropsWithChildren<DropdownAction>) {

  return <div className={`dropdown ${isActive ? 'active' : ''}`}>{children}</div>;
}
