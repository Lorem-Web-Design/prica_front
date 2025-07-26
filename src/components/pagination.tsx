import { PropsWithChildren, ReactNode, useState } from "react";
import Grid from "./grid";
import Paginator from "../utils/paginator";

type Pagination = {
  itemsPerPage: number;
};
export default function Pagination({ children, itemsPerPage }: PropsWithChildren<Pagination>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Paginator.pagination({ itemsPerPage, list: children as ReactNode[] });
  return (
    <div className="paginatorContainer">
      <Grid gap={12} sm={1} md={2} lg={3} def={1} className="">
        {items[currentIndex]}
      </Grid>
      <Grid gap={12} sm={2} md={2} lg={2} def={2} className="">
        <div className="paginatorPages col_s2" style={{ paddingTop: 12 }}>
          <ul>
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                }}
              >
                {index + 1}
              </li>
            ))}
          </ul>
        </div>
      </Grid>
    </div>
  );
}
