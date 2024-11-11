import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";

import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "./useDeletecabin";
import { useCreatecabin } from "./useCreatecabin";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useState } from "react";
import Cabin360View from "./Cabin360View";
import { HiViewBoards } from "react-icons/hi";
import { Md3dRotation } from "react-icons/md";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;
function CabinRow({ cabin }) {
  const {
    id: cabinId,
    name,
    maxCap,
    regularPrice,
    discount,
    image,
    description,
  } = cabin;
  const [show360View, setShow360View] = useState(false);
  const { isDeleting, mutate: deleteCabin } = useDeleteCabin();

  const { mutate, isAdding } = useCreatecabin();

  function handleDuplicate() {
    mutate({
      name: `Copy of ${name}`,
      maxCap,
      regularPrice,
      discount,
      image,
      description,
    });
  }

  return (
    <>
      <Table.Row>
        <Img src={image} />
        <Cabin>{name}</Cabin>
        <div>Fits up to {maxCap} people</div>
        <Price>{formatCurrency(regularPrice)}</Price>
        {discount ? (
          <Discount>{formatCurrency(discount)}</Discount>
        ) : (
          <span>&mdash;</span>
        )}
        <div>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={cabinId} />
              <Menus.List id={cabinId}>
                <Menus.Button
                  icon={<HiSquare2Stack />}
                  onClick={handleDuplicate}
                >
                  Duplicate
                </Menus.Button>
                <Modal.Open opens="edit">
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
                <Menus.Button
                  icon={<Md3dRotation />}
                  onClick={() => setShow360View(!show360View)}
                >
                  View 360
                </Menus.Button>
              </Menus.List>

              <Modal.Window name="edit">
                <CreateCabinForm cabintoEdit={cabin} />
              </Modal.Window>

              <Modal.Window name="delete">
                <ConfirmDelete
                  resourceName="cabin"
                  disabled={isDeleting}
                  onConfirm={() => deleteCabin(cabinId)}
                />
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
      </Table.Row>
      {show360View && (
        <Modal>
          <Cabin360View
            imageUrl={image}
            onClose={() => setShow360View(false)}
          />
        </Modal>
      )}
    </>
  );
}

export default CabinRow;
