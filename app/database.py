from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# ბაზის მისამართი (ავტომატურად იქმნება data ფოლდერში)
SQLALCHEMY_DATABASE_URL = "sqlite:///./data/onlypings.db"

# ძრავის შექმნა
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# --- მოდელები (ცხრილები) ---

# 1. მომხმარებლები (Users)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    discord_id = Column(String, nullable=True) # დისქორდთან ინტეგრაციისთვის
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # კავშირი გამოწერებთან
    subscriptions = relationship("Subscription", back_populates="owner")

# 2. პაკეტები (Packages) - აქ იქნება CS2-იც და Minecraft-იც
class Package(Base):
    __tablename__ = "packages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)          # მაგ: "Soldier", "Nether King", "Start Plan"
    game_type = Column(String)     # მაგ: "cs2", "minecraft", "web"
    description = Column(String)   # მოკლე აღწერა
    price = Column(Float)          # ფასი ლარებში
    
    # ტექნიკური ლიმიტები (Pterodactyl-ისთვის)
    cpu_limit = Column(Integer)    # მაგ: 200 (%)
    ram_limit = Column(Integer)    # მაგ: 4096 (MB)
    disk_limit = Column(Integer)   # მაგ: 10000 (MB)
    
    is_visible = Column(Boolean, default=True) # თუ გვინდა პაკეტის დამალვა წაშლის გარეშე

    subscriptions = relationship("Subscription", back_populates="package")

# 3. გამოწერები (Subscriptions) - ვინ რა იყიდა
class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    package_id = Column(Integer, ForeignKey("packages.id"))
    
    pterodactyl_server_id = Column(Integer, nullable=True) # კავშირი რეალურ სერვერთან
    
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime)    # როდის უმთავრდება ვადა
    status = Column(String, default="active") # active, expired, banned

    owner = relationship("User", back_populates="subscriptions")
    package = relationship("Package", back_populates="subscriptions")

# ბაზის შექმნის ფუნქცია
def init_db():
    Base.metadata.create_all(bind=engine)