const Header = (prenom = "met un prénom") => {
    console.log("🪙 ~ Header ~ props:",props.prenom)
  return (
    <header>
        <h1>{prenom}</h1>
    </header>
  );
}